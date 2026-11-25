// Every internal link and asset goes through BASE_URL (it resolves to "/" on Vercel).
const base = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : import.meta.env.BASE_URL + "/";
export const url = (path = "") => base + path.replace(/^\//, "");
