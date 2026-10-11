// The terminal client (xterm.js + worker glue) and the `fest` command, loaded
// on demand.
export const loadClient = () => import("./client.ts");
export const loadFest = () => import("./fest.ts");
