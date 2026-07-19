/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 *
 * Replaces api.decapcms.org with a self-hosted OAuth gateway.
 *
 * Setup:
 *   1. GitHub OAuth App callback URL: https://geek-oauth.3585770584.workers.dev/callback
 *   2. wrangler secret put GITHUB_CLIENT_ID
 *   3. wrangler secret put GITHUB_CLIENT_SECRET
 */

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

function renderPage(title, body, script) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0d1117;color:#c9d1d9;text-align:center;padding:20px;box-sizing:border-box}code{background:#21262d;padding:2px 8px;border-radius:4px}</style>
</head>
<body><div>${body}</div>${script || ""}</body>
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
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error_description || data.error);
  }
  return data.access_token;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const REDIRECT_URI = `${url.origin}/callback`;

    // Root — health check
    if (path === "/") {
      return new Response(renderPage("Geek OAuth", "<p>✅ Geek OAuth 代理正常工作</p><p style='margin-top:8px;font-size:14px;color:#8b949e'>用于 Decap CMS GitHub 登录</p>"), {
        headers: { "Content-Type": "text/html;charset=utf-8" },
      });
    }

    // GET /auth → redirect to GitHub
    if (path === "/auth") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        scope: "repo,user",
        redirect_uri: REDIRECT_URI,
      });
      return Response.redirect(`${GITHUB_AUTHORIZE}?${params.toString()}`, 302);
    }

    // GET /callback?code=xxx → exchange for token
    if (path === "/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        return new Response(renderPage("授权失败", `<h2>授权被取消</h2><p>${error}</p><p style="margin-top:16px;color:#8b949e">请关闭此窗口后重试</p>`), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 400,
        });
      }

      if (!code) {
        return new Response(renderPage("错误", "<h2>缺少授权码</h2><p style='color:#8b949e'>请重试登录</p>"), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 400,
        });
      }

      try {
        const token = await exchangeCode(code, env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET);

        // Send token back to Decap CMS via postMessage
        const script = `<script>
          console.log("OAuth callback: sending token to opener");
          try {
            if (window.opener && window.opener !== window) {
              window.opener.postMessage(${JSON.stringify({ token })}, "*");
              document.body.innerHTML += '<p style="color:#3fb950;margin-top:12px">✅ 已通知主页面，请关闭此窗口</p>';
            } else {
              document.body.innerHTML += '<p style="color:#f85149;margin-top:12px">⚠ 未检测到主窗口，请手动复制 token 后关闭</p>';
            }
          } catch(e) {
            document.body.innerHTML += '<p style="color:#f85149;margin-top:12px">发送失败: ' + e.message + '</p>';
          }
        </script>`;

        return new Response(renderPage("授权成功", "<p>✅ 授权成功</p><p style='color:#8b949e;font-size:14px'>窗口即将关闭…</p>", script), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
        });
      } catch (err) {
        return new Response(renderPage("授权失败", `<h2>Token 交换失败</h2><p style="color:#f85149">${err.message}</p>`), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 500,
        });
      }
    }

    // POST /refresh — refresh token
    if (path === "/refresh" && request.method === "POST") {
      try {
        const { token } = await request.json();
        return new Response(JSON.stringify({ token, provider: "github", backendName: "github" }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
          status: 400, headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
