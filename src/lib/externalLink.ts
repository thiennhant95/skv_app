export function buildExternalUrl(domain: string, username?: string, type?: string): string {
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
  if (type) params.set("type", type);
  // Co PWA (mo trong app cai san): skv chi mo mua dai ly khi co co nay
  params.set("pwa", "1");

  return `https://${domain}/affiliate-link?${params.toString()}`;
}
