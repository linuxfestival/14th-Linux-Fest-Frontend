export interface StaffModel {
    id: number;
    name: string;
    image: string;
    quote: string;
    role: StaffRole;
    team: StaffTeam;
}

export enum StaffRole {
    DIRECTOR = "DIRECTOR",
    HEAD = "HEAD",
    STAFF = "STAFF",
}

export enum StaffTeam {
    TECHNICAL = "TECHNICAL",
    MARKETING = "MARKETING",
    SCIENTIFIC = "SCIENTIFIC",
    EXECUTIVE = "EXECUTIVE",
    MEDIA = "MEDIA",
    DECORATION = "DECORATION",
    GRAPHICS = "GRAPHICS",
    DIRECTOR = "DIRECTOR"
}

export const StaffTeamTranslation: Record<StaffTeam, string> = {
    [StaffTeam.TECHNICAL]: "تکنیکال",
    [StaffTeam.MARKETING]: "تبلیغات",
    [StaffTeam.SCIENTIFIC]: "علکی",
    [StaffTeam.EXECUTIVE]: "اجرایی",
    [StaffTeam.MEDIA]: "رسانه",
    [StaffTeam.DECORATION]: "تزئینات",
    [StaffTeam.GRAPHICS]: "گرافیک",
    [StaffTeam.DIRECTOR]: "دبیر"
};