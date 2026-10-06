// The terminal client (xterm.js + worker glue), loaded on demand.
export const loadClient = () => import("./client.ts");
