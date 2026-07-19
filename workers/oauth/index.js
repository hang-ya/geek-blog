/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 *
 * Replaces api.decapcms.org (unreliable) with a self-hosted OAuth gateway.
 *
 * Setup:
 *   1. Create GitHub OAuth App at https://github.com/settings/developers
 *      - Callback URL: https://<this-worker>.workers.dev/callback
 *   2. Set secrets:
 *      wrangler secret put GITHUB_CLIENT_ID
 *      wrangler secret put GITHUB_CLIENT_SECRET
 *   3. Update public/admin/config.yml base_url → this worker's URL
 */

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

function html(msgOrToken) {
  // If passed a token object, send it back to Decap CMS via postMessage
  const isToken = typeof msgOrToken === "object";
  const script = isToken
    ? `<script>window.opener.postMessage(${JSON.stringify(msgOrToken)}, "*");window.close();</script>`
    : "";
  const body = isToken ? "<p>授权成功，窗口即将关闭…</p>" : `<p>${msgOrToken}</p>`;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>Geek OAuth</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0d1117;color:#c9d1d9;}</style>
</head>
<body>${body}${script}</body>
</html>`;
}

async function exchangeCode(code, clientId, clientSecret) {
  const res = await fetch(GITHUB_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "geek-blog-oauth-worker",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub token exchange failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
  }

  return data.access_token;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // GET /auth → redirect to GitHub
    if (path === "/auth" && request.method === "GET") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: "repo,user",
      });

      const redirect = `${GITHUB_AUTHORIZE}?${params.toString()}`;
      return Response.redirect(redirect, 302);
    }

    // GET /callback?code=xxx → exchange for token
    if (path === "/callback" && request.method === "GET") {
      const code = url.searchParams.get("code");

      if (!code) {
        return new Response(html("缺少授权码 — 请重试登录"), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 400,
        });
      }

      try {
        const token = await exchangeCode(
          code,
          env.GITHUB_CLIENT_ID,
          env.GITHUB_CLIENT_SECRET
        );

        // Return token to Decap CMS via postMessage
        return new Response(
          html({
            token,
            provider: "github",
            backendName: "github",
          }),
          { headers: { "Content-Type": "text/html;charset=utf-8" } }
        );
      } catch (err) {
        return new Response(html(`授权失败: ${err.message}`), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 500,
        });
      }
    }

    // POST /refresh — refresh token
    if (path === "/refresh" && request.method === "POST") {
      try {
        const { token } = await request.json();
        // GitHub tokens don't expire unless revoked; return as-is
        return new Response(
          JSON.stringify({
            token,
            provider: "github",
            backendName: "github",
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      } catch {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 404
    return new Response("Not Found", { status: 404 });
  },
};
