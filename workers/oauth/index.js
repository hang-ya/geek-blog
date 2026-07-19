/**
 * Decap CMS GitHub OAuth Proxy — Cloudflare Worker
 * Implements the NetlifyAuthenticator handshake protocol:
 *   1. popup → "authorizing:github" → opener
 *   2. opener → "authorizing:github" → popup
 *   3. popup → "authorization:github:success:{...}" → opener
 */

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = url.origin;

    // GET / → health check
    if (path === "/") {
      return new Response(htmlPage("Geek OAuth 代理正常 ✅"), {
        headers: { "Content-Type": "text/html;charset=utf-8" },
      });
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

    // GET /callback → exchange code, then perform netlify-auth handshake
    if (path === "/callback") {
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      if (error) {
        return new Response(htmlPage(`授权被取消: ${error}`), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 400,
        });
      }

      if (!code) {
        return new Response(htmlPage("缺少授权码"), {
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

        const tokenStr = JSON.stringify({ token: tokenData.access_token, provider: "github" });

        // NetlifyAuthenticator handshake:
        // 1. Send "authorizing:github" to opener
        // 2. Wait for opener to reply with "authorizing:github"
        // 3. Send "authorization:github:success:{json}"
        const script = `<script>
          var tokenPayload = ${JSON.stringify(tokenStr)};
          var sent = false;

          function sendAuth() {
            if (sent) return;
            sent = true;
            window.opener.postMessage("authorization:github:success:" + tokenPayload, "*");
            document.body.innerHTML += "<p style='color:#3fb950;margin-top:12px'>✅ 登录成功，请关闭此窗口</p>";
          }

          // Step 1: send handshake
          window.opener.postMessage("authorizing:github", "*");

          // Step 2: listen for response
          window.addEventListener("message", function(e) {
            if (e.data === "authorizing:github") {
              sendAuth();
            }
          });

          // Fallback: if no response within 3s, send anyway
          setTimeout(function() { sendAuth(); }, 3000);
        </script>`;

        return new Response(htmlPage("授权成功", script), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
        });
      } catch (e) {
        const errJson = JSON.stringify({ error: e.message });
        const script = `<script>
          window.opener.postMessage("authorizing:github", "*");
          window.addEventListener("message", function(e) {
            if (e.data === "authorizing:github") {
              window.opener.postMessage("authorization:github:error:" + ${JSON.stringify(errJson)}, "*");
            }
          });
          setTimeout(function() {
            window.opener.postMessage("authorization:github:error:" + ${JSON.stringify(errJson)}, "*");
          }, 3000);
        </script>`;

        return new Response(htmlPage(`Token 交换失败: ${e.message}`, script), {
          headers: { "Content-Type": "text/html;charset=utf-8" },
          status: 500,
        });
      }
    }

    // POST /auth/refresh → refresh token (GitHub tokens don't expire)
    if (path === "/auth/refresh" && request.method === "POST") {
      const url = new URL(request.url);
      const refreshToken = url.searchParams.get("refresh_token");
      return new Response(JSON.stringify({
        token: refreshToken || "",
        access_token: refreshToken || "",
        provider: "github",
      }), { headers: { "Content-Type": "application/json" } });
    }

    // POST /token → used by some CMS versions for refresh
    if (path === "/token" && request.method === "POST") {
      return new Response(JSON.stringify({ access_token: "" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};

function htmlPage(body, script) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>Geek OAuth</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;background:#0d1117;color:#c9d1d9;text-align:center;padding:20px;box-sizing:border-box}p{margin:4px 0}</style>
</head>
<body><div><p>${body}</p></div>${script || ""}</body>
</html>`;
}
