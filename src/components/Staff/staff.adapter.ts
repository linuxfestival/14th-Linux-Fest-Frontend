import { StaffRole, StaffTeam, StaffTeamTranslation, type StaffModel } from "../../models/StaffModel";

export interface StaffContact {
  href: string;
  label: string;
  platform: string;
}

const platforms: Record<string, { label: string; hosts: string[] }> = {
  linkedin: { label: "لینکدین", hosts: ["linkedin.com"] },
  github: { label: "گیت‌هاب", hosts: ["github.com"] },
  gitlab: { label: "گیت‌لب", hosts: ["gitlab.com"] },
  instagram: { label: "اینستاگرام", hosts: ["instagram.com"] },
  telegram: { label: "تلگرام", hosts: ["t.me", "telegram.me"] },
  twitter: { label: "اکس", hosts: ["x.com", "twitter.com"] },
  facebook: { label: "فیسبوک", hosts: ["facebook.com"] },
};

const contactFromValue = (value: string, hint: string): StaffContact | null => {
  const raw = value.trim();
  if (!raw) return null;
  const email = raw.replace(/^mailto:/i, "");
  if (/email|mail/i.test(hint) || /^mailto:/i.test(raw)) {
    return /^[^\s<>@?#]+@[^\s<>@?#]+\.[^\s<>@?#]+$/.test(email)
      ? { href: `mailto:${email}`, label: email, platform: "email" } : null;
  }
  // Accept absolute web URLs and ordinary scheme-less domains, never scripts.
  if (!/^(https?:\/\/|\/\/|(?:[\w-]+\.)+[a-z]{2,}(?:[/:]|$))/i.test(raw)) return null;
  try {
    const url = new URL(raw.startsWith("//") ? `https:${raw}` : /^https?:/i.test(raw) ? raw : `https://${raw}`);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.replace(/^www\./, "");
    const known = Object.entries(platforms).find(([, config]) => config.hosts.some(domain => host === domain || host.endsWith(`.${domain}`)));
    return { href: url.href, label: known?.[1].label ?? host, platform: known?.[0] ?? "website" };
  } catch { return null; }
};

export const getStaffContacts = (member: StaffModel): StaffContact[] => {
  const contacts = new Map<string, StaffContact>();
  const collect = (value: unknown, hint: string, depth = 0) => {
    if (typeof value === "string") {
      const contact = contactFromValue(value, hint);
      if (contact) contacts.set(contact.href, contact);
    } else if (depth < 3 && Array.isArray(value)) {
      value.forEach(item => collect(item, hint, depth + 1));
    } else if (depth < 3 && value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      const url = record.url ?? record.href ?? record.link;
      if (typeof url === "string") {
        collect(url, typeof record.platform === "string" ? record.platform : typeof record.type === "string" ? record.type : hint, depth + 1);
      } else {
        Object.entries(record).forEach(([key, item]) => collect(item, key, depth + 1));
      }
    }
  };
  Object.entries(member).forEach(([key, value]) => {
    if (/image|avatar|photo|picture|quote/i.test(key) || ["id", "name", "role", "team"].includes(key)) return;
    if (typeof value === "string" || /social|links|contacts/i.test(key)) collect(value, key);
  });
  return [...contacts.values()];
};

const teamOrder: string[] = ["DIRECTOR", "SCIENTIFIC", "TECHNICAL", "GRAPHICS", "MARKETING", "EXECUTIVE", "MEDIA", "DECORATION"];
const teamName = (team: string) => StaffTeamTranslation[team as StaffTeam] || team;

export const staffRoleLabel = (member: StaffModel) => {
  if (member.role === StaffRole.DIRECTOR) return "دبیر جشنواره";
  if (member.role === StaffRole.HEAD) return member.team ? `سرپرست تیم ${teamName(member.team)}` : "سرپرست تیم";
  if (member.role === StaffRole.STAFF) return member.team ? `عضو تیم ${teamName(member.team)}` : "عضو تیم";
  return member.role || "نقش اعلام نشده";
};

export const groupStaff = (staff: StaffModel[]) => {
  const groups = new Map<string, StaffModel[]>();
  staff.forEach(member => {
    const team = member.role === StaffRole.DIRECTOR ? StaffTeam.DIRECTOR : member.team || "OTHER";
    const members = groups.get(team) ?? [];
    members.push(member);
    groups.set(team, members);
  });
  const rank = (team: string) => teamOrder.includes(team) ? teamOrder.indexOf(team) : teamOrder.length;
  return [...groups.entries()].sort(([a], [b]) => rank(a) - rank(b)).map(([team, members]) => ({
    team,
    title: team === StaffTeam.DIRECTOR ? "دبیران" : team === "OTHER" ? "سایر همکاران" : StaffTeamTranslation[team as StaffTeam] ? `تیم ${teamName(team)}` : team,
    members: [...members].sort((a, b) => Number(b.role === StaffRole.HEAD) - Number(a.role === StaffRole.HEAD)),
  }));
};
