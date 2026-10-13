import { makeCall } from "../../utils/makeCall";

export interface SkyroomPresentation {
  id: number;
  name: string;
  room_url: string;
  start: string;
}

export interface SkyroomAccess {
  username: string;
  password: string;
  presentations: SkyroomPresentation[];
}

export const getSkyroomAccess = makeCall<void, SkyroomAccess>(
  "/api/users/skyroom/",
  "GET",
  true,
);

export function safeSkyroomUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    // Empty or unconfigured links remain disabled rather than navigating away.
  }
  return undefined;
}
