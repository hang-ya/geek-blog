/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * Based on sterlingwes/decap-proxy pattern
 *
 * GitHub OAuth App callback URL must be: https://geek-oauth.3585770584.workers.dev/callback
 * Secrets: GITHUB_OAUTH_ID, GITHUB_OAUTH_SECRET (via wrangler secret put)
 */

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = url.origin;

    // POST /token?grant_type=refresh_token
    // Decap CMS calls this to refresh tokens — GitHub tokens don't expire, pass through
    if (path === "/token" && request.method === "POST") {
      try {
        const body = await request.json();
        return new Response(JSON.stringify({
          access_token: body.refresh_token || "",
          token_type: "bearer",
        }), { headers: { "Content-Type": "application/json" } });
      } catch {
        return new Response(JSON.stringify({ error: "invalid_request" }), {
          status: 400, headers: { "Content-Type": "application/json" },
        });
      }
    }

    // GET /auth → redirect to GitHub OAuth
    if (path === "/auth") {
      const state = crypto.randomUUID().slice(0, 8);
      const params = new URLSearchParams({
        client_id: env.GITHUB_OAUTH_ID,
        scope: "repo,user",
        redirect_uri: `${origin}/callback`,
        state,
      });
      return Response.redirect(`${GITHUB_AUTHORIZE}?${params.toString()}`, 302);
    }

    // GET /callback → exchange code for token, send back via postMessage
    if (path === "/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        return new Response(html(`授权被取消: ${error}`), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 400,
        });
      }

      if (!code) {
        return new Response(html("缺少授权码"), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 400,
        });
      }

      try {
        const tokenRes = await fetch(GITHUB_TOKEN, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "geek-oauth" },
          body: JSON.stringify({
            client_id: env.GITHUB_OAUTH_ID,
            client_secret: env.GITHUB_OAUTH_SECRET,
            code,
          }),
        });
        const tokenData = await tokenRes.json();

        if (tokenData.error) {
          throw new Error(tokenData.error_description || tokenData.error);
        }

        // Send token to Decap CMS opener via postMessage
        const script = `<script>
          const data = { token: "${tokenData.access_token}", provider: "github", backendName: "github" };
          window.opener.postMessage(data, "*");
        </script>`;

        return new Response(html("授权成功 ✅", script), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
        });
      } catch (e) {
        return new Response(html(`Token 交换失败: ${e.message}`), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 500,
        });
      }
    }

    // GET / — health check
    if (path === "/") {
      return new Response(html("Geek OAuth 代理正常 ✅"), {
        headers: { "Content-Type": "text/html;charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

function html(body, script) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>Geek OAuth</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0d1117;color:#c9d1d9;text-align:center;padding:20px;box-sizing:border-box}p{margin:4px 0}</style>
</head>
<body><div><p>${body}</p></div>${script || ""}</body>
</html>`;
}
