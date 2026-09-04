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

    /* His games, for the same reason and by the same route.

       api.chess.com sends no Cross-Origin-Resource-Policy, so a cross-origin-isolated page
       cannot read it however friendly its CORS headers are — exactly the wall the puzzle
       download hit, which presented as "failed to fetch" with nothing to say why. Fetched
       server-side instead, where none of it applies.

       It also sets the User-Agent the API asks for, which a browser cannot do: the header
       is forbidden to page scripts, so a direct fetch could not comply even if the walls
       were down. */
    if (url.pathname.startsWith("/chess/")) {
      const rest = url.pathname.slice("/chess/".length);
      /* Only this player's archives, and only the two shapes we use. Anything else is
         refused rather than forwarded — a proxy that passes on whatever it is handed is a
         way for any page to make requests wearing our address. */
      const ok = /^[a-z0-9_-]+\/games\/archives$/.test(rest)
        || /^[a-z0-9_-]+\/games\/\d{4}\/\d{2}$/.test(rest);
      if (!ok) return new Response("bad path", { status: 400 });
      /* The caller's ETag is passed straight through, because chess.com honours
         If-None-Match and answers 304 with no body at all. That is what makes "give me
         any new games" cost a couple of hundred bytes instead of re-downloading a month
         of PGN — his August alone is 1.4MB. */
      const inm = request.headers.get("If-None-Match");
      const upstream = await fetch("https://api.chess.com/pub/player/" + rest, {
        headers: Object.assign({
          "User-Agent": "chess-repertoire-trainer (personal study tool; contact via github.com/Mesner24)",
          "Accept": "application/json"
        }, inm ? { "If-None-Match": inm } : {})
      });
      const h = new Headers();
      h.set("Access-Control-Allow-Origin", "*");
      h.set("Cross-Origin-Resource-Policy", "cross-origin");
      h.set("Content-Type", "application/json");
      const tag = upstream.headers.get("ETag");
      if (tag) h.set("ETag", tag);
      /* Without this the page cannot READ the ETag: cross-origin JavaScript only sees a
         handful of headers unless they are named here, so the whole scheme would fail
         silently with the browser re-downloading every time. */
      h.set("Access-Control-Expose-Headers", "ETag");
      /* Revalidate rather than reuse. The app keeps its own copy of every month and knows
         which ones can still change; a browser cache sitting in front of that would serve
         a stale month and make "refresh" a lie. */
      h.set("Cache-Control", "no-cache");
      /* 304 must stay a 304 — it has no body, and giving it one would break the meaning. */
      if (upstream.status === 304) return new Response(null, { status: 304, headers: h });
      return new Response(upstream.body, { status: upstream.status, headers: h });
    }
    return env.ASSETS.fetch(request);
  }
};
