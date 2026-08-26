const RELEASE = "https://github.com/Mesner24/chess-repertoire/releases/download/puzzles-v1/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/puzzles/")) {
      const name = url.pathname.slice("/puzzles/".length);
      /* An allowlist, not an escape: this proxies whatever name it is given, so the name
         has to be one that cannot climb out of the release. */
      if (!/^[A-Za-z0-9._-]+$/.test(name) || name.indexOf("..") >= 0) {
        return new Response("bad asset name", { status: 400 });
      }
      const upstream = await fetch(RELEASE + name, { redirect: "follow" });
      const h = new Headers();
      h.set("Access-Control-Allow-Origin", "*");
      /* Both are needed. CORS lets the fetch happen; CORP lets a cross-origin-isolated
         page accept the result. */
      h.set("Cross-Origin-Resource-Policy", "cross-origin");
      h.set("Content-Type", name.endsWith(".json") ? "application/json" : "application/octet-stream");
      /* GitHub marks these as attachments. Left in place the browser would try to
         download the file rather than hand it to the app. */
      const len = upstream.headers.get("content-length");
      if (len) h.set("Content-Length", len);
      h.set("Cache-Control", "public, max-age=31536000, immutable");
      return new Response(upstream.body, { status: upstream.status, headers: h });
    }
    return env.ASSETS.fetch(request);
  }
};
