// The `fest` command: browse the programme and manage the cart from the
// terminal. Runs on the page, with the site's own API calls and login; the
// terminal only sends a command name and its arguments, never sees the token,
// and can only ask for the actions below.
import type { AxiosError } from "axios";
import {
  addItemToCart,
  getCartPresentations,
  getCouponStatus,
  removeItemFromCart,
} from "../core/cart/cart.api";
import { findCartTimingConflicts } from "../core/cart/cart.conflicts";
import { getCartThunk } from "../core/cart/cart.thunk";
import type { CartItemDto } from "../core/cart/cart.types";
import { getAllPresentations } from "../core/presentations/presentations.api";
import { type PresentationDto, PresentationService } from "../core/presentations/presentations.dto";
import store from "../store";
import type { ServiceReply } from "./kernel/files.ts";

interface Out {
  color: boolean;
  cols: number;
}

const HELP = `fest: the Linux Fest programme, from your shell

  fest list [workshops|talks|packages] [words]   browse the programme
  fest show <id>          details of a workshop or talk
  fest cart               what is in your cart
  fest add <id>...        add to your cart (log in first)
  fest rm <id>...         remove from your cart
  fest checkout           go to the cart page to pay
  fest open <id>          open the page of a workshop or talk
  fest coupon <code>      check a discount code
  fest login              go to the login page
  fest whoami             are you logged in?

  e.g.  fest list workshops docker
        fest list | grep -i kernel
`;

const ok = (body: string): ServiceReply => ({ status: 0, body });
const fail = (body: string, status = 1): ServiceReply => ({ status, body: `fest: ${body}\n` });

/** HTML from the API as text. DOMParser builds an inert document: no scripts run, nothing loads. */
const htmlText = (html: string) =>
  new DOMParser().parseFromString(html.replace(/<\/(p|div|li|h\d)>|<br\s*\/?>/gi, "$&\n"), "text/html").body.textContent ?? "";

/**
 * Text from the API goes to a terminal: decode HTML, then drop control
 * characters (escape sequences could move the cursor, retitle the window or
 * print fake links) and bidi overrides.
 */
export const clean = (s: unknown) =>
  htmlText(String(s ?? ""))
    // eslint-disable-next-line no-control-regex -- removing control characters is the point
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const style = (o: Out, code: string, s: string) => (o.color ? `\x1b[${code}m${s}\x1b[0m` : s);

const fit = (s: string, w: number) => (s.length > w ? s.slice(0, Math.max(0, w - 1)) + "…" : s.padEnd(w));

function wrap(text: string, width: number) {
  const out: string[] = [];
  for (const para of text.split(/\n+/)) {
    let line = "";
    for (const word of para.split(" ").filter(Boolean)) {
      if (line && line.length + 1 + word.length > width) {
        out.push(line);
        line = word;
      } else line = line ? `${line} ${word}` : word;
    }
    if (line) out.push(line);
  }
  return out.join("\n");
}

const when = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Tehran",
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const hour = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const fmtWhen = (d: Date | string) => {
  const t = new Date(d);
  return Number.isFinite(t.getTime()) ? when.format(t).replace(",", "") : "TBA";
};
const fmtPrice = (n: number) => (n ? `${n.toLocaleString("en-US")} T` : "free");

const KIND: Record<string, string> = {
  [PresentationService.WORKSHOP]: "workshop",
  [PresentationService.TALK]: "talk",
  [PresentationService.PACKAGE]: "package",
};
const FILTERS: Record<string, PresentationService> = {
  workshop: PresentationService.WORKSHOP,
  workshops: PresentationService.WORKSHOP,
  talk: PresentationService.TALK,
  talks: PresentationService.TALK,
  package: PresentationService.PACKAGE,
  packages: PresentationService.PACKAGE,
};

let cache: { at: number; list: PresentationDto[] } | undefined;
async function programme() {
  if (cache && Date.now() - cache.at < 60_000) return cache.list;
  const { data } = await getAllPresentations();
  const list = [...data].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  cache = { at: Date.now(), list };
  return list;
}

const loggedIn = () => store.getState().auth.isAuthenticated;

/**
 * The cart, shared for a few seconds so a shell loop over `fest list` or
 * `fest show` doesn't send a request per iteration. Cleared on add and rm.
 */
let cartCache: { at: number; session: unknown; items: Promise<CartItemDto[]> } | undefined;
const CART_TTL = 5_000;

function cartItems() {
  // A new login replaces auth.user, so another account never sees this cart.
  const session = store.getState().auth.user;
  if (!cartCache || cartCache.session !== session || Date.now() - cartCache.at >= CART_TTL) {
    const items = getCartPresentations().then((r) => r.data);
    cartCache = { at: Date.now(), session, items };
    items.catch(() => {
      if (cartCache?.items === items) cartCache = undefined;
    });
  }
  return cartCache.items;
}

async function cart(): Promise<CartItemDto[] | undefined> {
  if (!loggedIn()) return undefined;
  try {
    return await cartItems();
  } catch {
    return undefined;
  }
}

const apiError = (e: unknown) => {
  const err = e as AxiosError<{ detail?: string }>;
  return clean(err.response?.data?.detail) || clean(err.message) || "request failed";
};

/** Ids are positive integers; anything else is rejected before it reaches a URL. */
const parseId = (s: string | undefined) => (s && /^\d{1,9}$/.test(s) ? Number(s) : undefined);

function seats(p: PresentationDto) {
  if (!p.is_registration_active) return "closed";
  return p.remained_capacity > 0 ? String(p.remained_capacity) : "full";
}

function mark(o: Out, items: CartItemDto[] | undefined, id: number) {
  const item = items?.find((i) => i.presentation.id === id);
  if (!item) return "";
  return item.payment_state === "COMPLETED" ? style(o, "1;32", " [bought]") : style(o, "1;33", " [in cart]");
}

async function list(args: string[], o: Out) {
  let kind: PresentationService | undefined;
  if (args[0] && FILTERS[args[0].toLowerCase()]) kind = FILTERS[args.shift()!.toLowerCase()];
  const words = args.map((w) => w.toLowerCase());
  const [all, items] = await Promise.all([programme(), cart()]);
  const rows = all.filter((p) => {
    if (kind && p.service_type !== kind) return false;
    const text = `${p.en_title} ${p.fa_title} ${p.tags?.map((t) => t.name).join(" ")} ${p.presenters
      ?.map((x) => `${x.first_name} ${x.last_name}`)
      .join(" ")}`.toLowerCase();
    return words.every((w) => text.includes(w));
  });
  if (!rows.length) return ok("nothing found\n");

  const narrow = o.cols < 72;
  const lines: string[] = [];
  if (!narrow) lines.push(style(o, "1", `${"ID".padEnd(5)}${"TYPE".padEnd(10)}${"WHEN".padEnd(18)}${"PRICE".padEnd(12)}${"SEATS".padEnd(7)}TITLE`));
  for (const p of rows) {
    const title = clean(p.en_title) || clean(p.fa_title);
    const id = style(o, "1;36", String(p.id).padEnd(5));
    const m = mark(o, items, p.id);
    if (narrow) {
      lines.push(`${id}${fit(title, Math.max(10, o.cols - 6))}${m}`);
      lines.push(style(o, "2", `     ${KIND[p.service_type] ?? ""} · ${fmtWhen(p.start)} · ${fmtPrice(p.cost)} · ${seats(p)}`));
    } else {
      const fixed = `${(KIND[p.service_type] ?? "").padEnd(10)}${fmtWhen(p.start).padEnd(18)}${fmtPrice(p.cost).padEnd(12)}${seats(p).padEnd(7)}`;
      lines.push(`${id}${fixed}${fit(title, Math.max(10, o.cols - 53)).trimEnd()}${m}`);
    }
  }
  lines.push("", style(o, "2", "fest show <id> for details, fest add <id> to add it to your cart"));
  return ok(lines.join("\n") + "\n");
}

async function show(args: string[], o: Out) {
  const id = parseId(args[0]);
  if (id === undefined) return fail("usage: fest show <id>", 2);
  const [all, items] = await Promise.all([programme(), cart()]);
  const p = all.find((x) => x.id === id);
  if (!p) return fail(`no workshop or talk with id ${id} (see fest list)`);
  const w = Math.min(o.cols, 100) - 2;
  const end = new Date(p.end);
  const lines = [
    `${style(o, "1;36", `#${p.id}`)}  ${style(o, "1", clean(p.en_title) || clean(p.fa_title))}${mark(o, items, p.id)}`,
    [
      KIND[p.service_type],
      `${fmtWhen(p.start)}${Number.isFinite(end.getTime()) ? `-${hour.format(end)}` : ""} (Tehran)`,
      fmtPrice(p.cost),
      p.is_registration_active ? `${Math.max(0, p.remained_capacity)}/${p.capacity} seats left` : "registration closed",
    ]
      .filter(Boolean)
      .join(" · "),
  ];
  const by = (p.presenters ?? []).map((x) => clean(`${x.first_name} ${x.last_name}`)).filter(Boolean);
  if (by.length) lines.push(`by ${by.join(", ")}`);
  const tags = (p.tags ?? []).map((t) => clean(t.name)).filter(Boolean);
  if (tags.length) lines.push(style(o, "2", `tags: ${tags.join(", ")}`));
  const desc = clean(p.en_description);
  if (desc) lines.push("", wrap(desc, w));
  lines.push("", style(o, "4", `${location.origin}/workshop/${p.id}`));
  return ok(lines.join("\n") + "\n");
}

const needLogin = () => fail("you need to log in first: fest login");

async function showCart(o: Out) {
  if (!loggedIn()) return needLogin();
  let items: CartItemDto[];
  try {
    items = await cartItems();
  } catch (e) {
    return fail(apiError(e));
  }
  const pending = items.filter((i) => i.payment_state !== "COMPLETED");
  const bought = items.filter((i) => i.payment_state === "COMPLETED");
  const line = (i: CartItemDto) =>
    `  ${style(o, "1;36", String(i.presentation.id).padEnd(5))}${fmtWhen(i.presentation.start).padEnd(18)}${fmtPrice(
      i.presentation.cost,
    ).padEnd(12)}${clean(i.presentation.en_title) || clean(i.presentation.fa_title)}`;
  const lines: string[] = [];
  if (!pending.length) lines.push("Your cart is empty. Browse with: fest list");
  else {
    lines.push(style(o, "1", "In your cart:"), ...pending.map(line));
    const total = pending.reduce((s, i) => s + i.presentation.cost, 0);
    lines.push(`  total: ${style(o, "1", fmtPrice(total))}`);
  }
  for (const c of findCartTimingConflicts(items))
    lines.push(style(o, "1;31", `  warning: #${c.selected.presentation.id} overlaps #${c.other.presentation.id}`));
  if (bought.length) lines.push("", style(o, "1", "Already bought:"), ...bought.map(line));
  if (pending.length) lines.push("", "Pay with: fest checkout (discount codes go there)");
  return ok(lines.join("\n") + "\n");
}

const refreshCart = () => {
  cartCache = undefined;
  return store.dispatch(getCartThunk()).catch(() => {});
};

async function add(args: string[], o: Out) {
  if (!loggedIn()) return needLogin();
  if (!args.length) return fail("usage: fest add <id>...", 2);
  const ids = args.map(parseId);
  if (ids.some((i) => i === undefined)) return fail("ids are numbers (see fest list)", 2);
  const [all, items] = await Promise.all([programme(), cart()]);
  const lines: string[] = [];
  let failed = false;
  const added: number[] = [];
  for (const id of ids as number[]) {
    const p = all.find((x) => x.id === id);
    const title = p ? clean(p.en_title) || clean(p.fa_title) : "";
    const inCart = items?.find((i) => i.presentation.id === id);
    let err = "";
    if (!p) err = "no such workshop or talk";
    else if (inCart?.payment_state === "COMPLETED") err = "you already bought this";
    else if (inCart) err = "already in your cart";
    else if (!p.is_registration_active) err = "registration is closed";
    else if (p.remained_capacity <= 0) err = "it is full";
    if (!err) {
      try {
        await addItemToCart(null, { id });
        added.push(id);
        lines.push(`${style(o, "1;32", "added")}  #${id} ${title}`);
        continue;
      } catch (e) {
        err = apiError(e);
      }
    }
    failed = true;
    lines.push(`${style(o, "1;31", "failed")} #${id} ${title}${title ? ": " : ""}${err}`);
  }
  if (added.length) {
    await refreshCart();
    const now = await cart();
    for (const c of findCartTimingConflicts(now ?? []))
      if (added.includes(c.selected.presentation.id) || added.includes(c.other.presentation.id))
        lines.push(style(o, "1;33", `warning: #${c.selected.presentation.id} overlaps #${c.other.presentation.id}`));
    lines.push("", "See your cart with: fest cart");
  }
  return { status: failed ? 1 : 0, body: lines.join("\n") + "\n" };
}

async function remove(args: string[], o: Out) {
  if (!loggedIn()) return needLogin();
  if (!args.length) return fail("usage: fest rm <id>...", 2);
  const ids = args.map(parseId);
  if (ids.some((i) => i === undefined)) return fail("ids are numbers (see fest cart)", 2);
  const items = await cart();
  const lines: string[] = [];
  let failed = false;
  let removed = false;
  for (const id of ids as number[]) {
    const item = items?.find((i) => i.presentation.id === id && i.payment_state !== "COMPLETED");
    if (!item) {
      failed = true;
      lines.push(`${style(o, "1;31", "failed")} #${id}: not in your cart`);
      continue;
    }
    try {
      await removeItemFromCart(null, { id: item.id });
      removed = true;
      lines.push(`${style(o, "1;32", "removed")} #${id} ${clean(item.presentation.en_title)}`);
    } catch (e) {
      failed = true;
      lines.push(`${style(o, "1;31", "failed")} #${id}: ${apiError(e)}`);
    }
  }
  if (removed) await refreshCart();
  return { status: failed ? 1 : 0, body: lines.join("\n") + "\n" };
}

async function coupon(args: string[], o: Out) {
  const code = args[0];
  if (!code || args.length > 1) return fail("usage: fest coupon <code>", 2);
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(code)) return fail("that is not a valid code");
  if (!loggedIn()) return needLogin();
  try {
    const { data } = await getCouponStatus(null, { coupon: encodeURIComponent(code) });
    if (!data?.is_valid) return fail("that code is not valid (or has been used up)");
    return ok(`${style(o, "1;32", "valid")}: ${Number(data.percentage) || 0}% off. Use it on the payment page: fest checkout\n`);
  } catch {
    return fail("that code is not valid (or has been used up)");
  }
}

/** Leaves the home page, which closes the terminal; output first. */
function go(path: string, what: string): ServiceReply {
  setTimeout(() => {
    import("../routes.tsx").then(({ default: router }) => router.navigate(path));
  }, 700);
  return ok(`Opening ${what}...\n`);
}

export async function festCommand(args: string[], cols: number): Promise<ServiceReply> {
  const [color, cmd, ...rest] = args;
  const o: Out = { color: color === "1", cols: Math.max(20, cols || 80) };
  try {
    switch (cmd) {
      case undefined:
      case "help":
      case "-h":
      case "--help":
        return ok(HELP);
      case "list":
      case "ls":
        return await list(rest, o);
      case "show":
      case "info":
        return await show(rest, o);
      case "cart":
        return await showCart(o);
      case "add":
        return await add(rest, o);
      case "rm":
      case "remove":
        return await remove(rest, o);
      case "coupon":
        return await coupon(rest, o);
      case "checkout":
        return loggedIn() ? go("/profile/cart/list", "your cart") : needLogin();
      case "open": {
        const id = parseId(rest[0]);
        return id === undefined ? fail("usage: fest open <id>", 2) : go(`/workshop/${id}`, `#${id}`);
      }
      case "login":
        return loggedIn() ? ok("You are already logged in.\n") : go("/login", "the login page");
      case "whoami":
        return ok(loggedIn() ? "You are logged in.\n" : "You are not logged in. Log in with: fest login\n");
      default:
        return fail(`unknown command '${clean(cmd)}'. See: fest help`, 2);
    }
  } catch (e) {
    return fail(apiError(e));
  }
}
