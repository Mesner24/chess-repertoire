/* GENERATED — rebuilt with the app. Cache: dfa3f6ebcd28 */
var CACHE = "repertoire-dfa3f6ebcd28";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
    .then(function () { return self.skipWaiting(); }));
});

/* Every cache but this build's is deleted, so old versions cannot survive to be
   served later. */
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Network first, falling back to the cache after a short wait. Cache first would open
   a few hundred milliseconds quicker and would also be the reason a fix appears not to
   have landed. Online he gets what is actually published; offline he gets the last
   version that worked. */
function fromNetwork(req, ms) {
  return new Promise(function (resolve, reject) {
    var t = setTimeout(function () { reject(new Error("slow")); }, ms);
    fetch(req).then(function (res) {
      clearTimeout(t);
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      resolve(res);
    }, function (err) { clearTimeout(t); reject(err); });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fromNetwork(req, 2500).catch(function () {
    return caches.match(req).then(function (hit) { return hit || Response.error(); });
  }));
});
