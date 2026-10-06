// Local time imports (_tzset_js, _localtime_js, _mktime_js) ported from
// Emscripten's src/lib/libtime.js (MIT), plus a small strptime.
import type { Image } from "./image.ts";

const LEAP = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
const REGULAR = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const isLeap = (y: number) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
const yday = (d: Date) => (isLeap(d.getFullYear()) ? LEAP : REGULAR)[d.getMonth()] + d.getDate() - 1;

function offsets(year: number) {
  const winter = new Date(year, 0, 1).getTimezoneOffset();
  const summer = new Date(year, 6, 1).getTimezoneOffset();
  return { winter, summer };
}

export function timeImports(img: Image) {
  const zone = (off: number) => {
    const sign = off >= 0 ? "-" : "+";
    const a = Math.abs(off);
    return `UTC${sign}${String(Math.floor(a / 60)).padStart(2, "0")}${String(a % 60).padStart(2, "0")}`;
  };
  return {
    _tzset_js(timezone: number, daylight: number, stdName: number, dstName: number) {
      const { winter, summer } = offsets(new Date().getFullYear());
      const dv = img.dv();
      dv.setUint32(timezone, Math.max(winter, summer) * 60, true);
      dv.setInt32(daylight, Number(winter !== summer), true);
      const [std, dst] = summer < winter ? [winter, summer] : [summer, winter];
      img.writeStr(stdName, zone(std), 17);
      img.writeStr(dstName, zone(dst), 17);
    },
    _localtime_js(time: bigint, tm: number) {
      const date = new Date(Number(time) * 1000);
      if (isNaN(date.getTime())) return 1;
      const dv = img.dv();
      dv.setInt32(tm, date.getSeconds(), true);
      dv.setInt32(tm + 4, date.getMinutes(), true);
      dv.setInt32(tm + 8, date.getHours(), true);
      dv.setInt32(tm + 12, date.getDate(), true);
      dv.setInt32(tm + 16, date.getMonth(), true);
      dv.setInt32(tm + 20, date.getFullYear() - 1900, true);
      dv.setInt32(tm + 24, date.getDay(), true);
      dv.setInt32(tm + 28, yday(date), true);
      dv.setInt32(tm + 36, -date.getTimezoneOffset() * 60, true);
      const { winter, summer } = offsets(date.getFullYear());
      dv.setInt32(tm + 32, Number(summer !== winter && date.getTimezoneOffset() === Math.min(winter, summer)), true);
      return 0;
    },
    _mktime_js(tm: number): bigint {
      const dv = img.dv();
      const g = (o: number) => dv.getInt32(tm + o, true);
      const date = new Date(g(20) + 1900, g(16), g(12), g(8), g(4), g(0), 0);
      if (isNaN(date.getTime())) return -1n;
      let dst = g(32);
      const guessed = date.getTimezoneOffset();
      const { winter, summer } = offsets(date.getFullYear());
      const dstOffset = Math.min(winter, summer);
      if (dst < 0) dst = Number(summer !== winter && dstOffset === guessed);
      else if (dst > 0 !== (dstOffset === guessed)) {
        const trueOffset = dst > 0 ? dstOffset : Math.max(winter, summer);
        date.setTime(date.getTime() + (trueOffset - guessed) * 60_000);
        if (isNaN(date.getTime())) return -1n;
      }
      dv.setInt32(tm + 32, dst, true);
      dv.setInt32(tm + 24, date.getDay(), true);
      dv.setInt32(tm + 28, yday(date), true);
      dv.setInt32(tm, date.getSeconds(), true);
      dv.setInt32(tm + 4, date.getMinutes(), true);
      dv.setInt32(tm + 8, date.getHours(), true);
      dv.setInt32(tm + 12, date.getDate(), true);
      dv.setInt32(tm + 16, date.getMonth(), true);
      dv.setInt32(tm + 20, date.getFullYear() - 1900, true);
      return BigInt(Math.floor(date.getTime() / 1000));
    },
    strptime(buf: number, format: number, tm: number) {
      return strptime(img, buf, format, tm);
    },
  };
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const EXPAND: Record<string, string> = { T: "%H:%M:%S", D: "%m/%d/%y", R: "%H:%M", F: "%Y-%m-%d", r: "%I:%M:%S %p", c: "%a %b %e %H:%M:%S %Y", x: "%m/%d/%y", X: "%H:%M:%S" };

/** strptime(3): returns a pointer past the parsed input, or 0. */
function strptime(img: Image, buf: number, format: number, tm: number): number {
  let fmt = img.str(format);
  for (let i = 0; i < 3; i++) fmt = fmt.replace(/%([TDRFrcxX])/g, (_, c: string) => EXPAND[c]);
  const input = img.str(buf);
  const dv = img.dv();
  const field = (o: number, v: number) => dv.setInt32(tm + o, v, true);
  let pos = 0;
  let pm = -1;
  let hour12 = -1;
  let century = -1;
  let year2 = -1;
  const num = (max: number, digits: number) => {
    const m = /^[+-]?\d+/.exec(input.slice(pos, pos + digits + (/[+-]/.test(input[pos] ?? "") ? 1 : 0)));
    if (!m) return null;
    const v = parseInt(m[0], 10);
    if (v > max) return null;
    pos += m[0].length;
    return v;
  };
  const name = (list: string[]) => {
    const rest = input.slice(pos).toLowerCase();
    for (let i = 0; i < list.length; i++) {
      for (const n of [list[i], list[i].slice(0, 3)]) {
        if (rest.startsWith(n)) {
          pos += n.length;
          return i;
        }
      }
    }
    return null;
  };
  for (let i = 0; i < fmt.length; i++) {
    const c = fmt[i];
    if (/\s/.test(c)) {
      while (/\s/.test(input[pos] ?? "")) pos++;
      continue;
    }
    if (c !== "%") {
      if (input[pos] !== c) return 0;
      pos++;
      continue;
    }
    let spec = fmt[++i];
    if (spec === "E" || spec === "O") spec = fmt[++i];
    let v: number | null;
    switch (spec) {
      case "%":
        if (input[pos++] !== "%") return 0;
        continue;
      case "n":
      case "t":
        while (/\s/.test(input[pos] ?? "")) pos++;
        continue;
      case "Y":
        if ((v = num(99999, 4)) === null) return 0;
        field(20, v - 1900);
        continue;
      case "C":
        if ((v = num(99, 2)) === null) return 0;
        century = v;
        continue;
      case "y":
        if ((v = num(99, 2)) === null) return 0;
        year2 = v;
        continue;
      case "m":
        if ((v = num(12, 2)) === null || v < 1) return 0;
        field(16, v - 1);
        continue;
      case "d":
      case "e":
        while (input[pos] === " ") pos++;
        if ((v = num(31, 2)) === null || v < 1) return 0;
        field(12, v);
        continue;
      case "H":
      case "k":
        if ((v = num(23, 2)) === null) return 0;
        field(8, v);
        continue;
      case "I":
      case "l":
        if ((v = num(12, 2)) === null || v < 1) return 0;
        hour12 = v;
        continue;
      case "M":
        if ((v = num(59, 2)) === null) return 0;
        field(4, v);
        continue;
      case "S":
        if ((v = num(61, 2)) === null) return 0;
        field(0, v);
        continue;
      case "j":
        if ((v = num(366, 3)) === null || v < 1) return 0;
        field(28, v - 1);
        continue;
      case "p": {
        const r = input.slice(pos, pos + 2).toLowerCase();
        if (r !== "am" && r !== "pm") return 0;
        pm = r === "pm" ? 1 : 0;
        pos += 2;
        continue;
      }
      case "b":
      case "B":
      case "h":
        if ((v = name(MONTHS)) === null) return 0;
        field(16, v);
        continue;
      case "a":
      case "A":
        if ((v = name(DAYS)) === null) return 0;
        field(24, v);
        continue;
      case "s": {
        const m = /^-?\d+/.exec(input.slice(pos));
        if (!m) return 0;
        pos += m[0].length;
        const d = new Date(parseInt(m[0], 10) * 1000);
        field(0, d.getSeconds());
        field(4, d.getMinutes());
        field(8, d.getHours());
        field(12, d.getDate());
        field(16, d.getMonth());
        field(20, d.getFullYear() - 1900);
        continue;
      }
      case "z": {
        const m = /^(Z|[+-]\d\d:?\d\d)/.exec(input.slice(pos));
        if (!m) return 0;
        pos += m[0].length;
        continue;
      }
      case "Z": {
        const m = /^[A-Za-z]+/.exec(input.slice(pos));
        if (m) pos += m[0].length;
        continue;
      }
      default:
        return 0;
    }
  }
  if (year2 >= 0) field(20, (century >= 0 ? century * 100 : year2 < 69 ? 2000 : 1900) + year2 - 1900);
  else if (century >= 0) field(20, century * 100 - 1900);
  if (hour12 >= 0) field(8, (hour12 % 12) + (pm === 1 ? 12 : 0));
  else if (pm === 1) {
    const h = dv.getInt32(tm + 8, true);
    if (h < 12) field(8, h + 12);
  }
  const y = dv.getInt32(tm + 20, true) + 1900;
  const mon = dv.getInt32(tm + 16, true);
  const mday = dv.getInt32(tm + 12, true);
  if (mday >= 1 && mon >= 0 && mon < 12) {
    const d = new Date(y, mon, mday);
    field(24, d.getDay());
    field(28, yday(d));
  }
  return buf + new TextEncoder().encode(input.slice(0, pos)).length;
}
