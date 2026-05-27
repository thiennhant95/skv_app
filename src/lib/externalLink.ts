export function buildExternalUrl(domain: string, username?: string, path?: string): string {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("skv_token");
    if (!username) {
      try {
        const userStr = localStorage.getItem("skv_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          username = user.username || user.fullname || "";
        }
      } catch { /* silent */ }
    }
  }

  const params = new URLSearchParams();

  if (domain === "protandimnrf2.vn") {
    params.set("token", "LKSJHDoikiSIJUDfpioywheiufh");
    if (username) params.set("username", username);
    params.set("redirect", "/dashboard/index");
    return `https://${domain}/sso/login?${params.toString()}`;
  }

  if (username) params.set("username", username);
  params.set("source", "protandimnrf2.vn");
  if (token) params.set("token", token);

  const basePath = path || "affiliate-link";
  return `https://${domain}/${basePath}?${params.toString()}`;
}
