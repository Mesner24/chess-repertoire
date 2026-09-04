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
      const upstream = await fetch("https://api.chess.com/pub/player/" + rest, {
        headers: {
          "User-Agent": "chess-repertoire-trainer (personal study tool; contact via github.com/Mesner24)",
          "Accept": "application/json"
        }
      });
      const h = new Headers();
      h.set("Access-Control-Allow-Origin", "*");
      h.set("Cross-Origin-Resource-Policy", "cross-origin");
      h.set("Content-Type", "application/json");
      /* A finished month never changes, but the current one does, so this is short. The
         app caches months itself and only re-asks for the ones it must. */
      h.set("Cache-Control", "public, max-age=3600");
      return new Response(upstream.body, { status: upstream.status, headers: h });
    }
    return env.ASSETS.fetch(request);
  }
};
