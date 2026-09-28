/* ============================================================
   X STORE — caching service worker
   ------------------------------------------------------------
   Goal: the 300 KB page is downloaded once, not on every visit,
   while any update you publish still reaches the customer.
   Rules:
     • HTML  -> network first, cache as backup.
             The browser re-validates with the server (ETag),
             so a repeat visit costs a few hundred bytes, not 300 KB.
             If the network is down, the saved copy is shown instantly.
     • Same-origin files -> served from the cache first, refreshed in the background.
     • Firebase / Cloudinary -> untouched: they already have their own CDN caching,
     and caching them here would only waste the customer's data.
   ============================================================ */
const CACHE = "xstore-v4";
const SHELL = ["./", "./index.html"];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  /* never touch other origins (Firebase, Cloudinary, fonts...) — their CDN handles them */
  if (url.origin !== self.location.origin) return;
  if (url.pathname === "/sw.js") return;

  /* the page itself: always try the network so a fresh update shows up,
     but fall back to the saved copy the moment the network is slow or gone */
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")).then((hit) =>
          hit || new Response("<h1>لا يوجد اتصال</h1><p>افتح الموقع مرة واحدة وأنت متصل.</p>", {
            headers: { "Content-Type": "text/html; charset=utf-8" }, status: 503
          })
        ))
    );
    return;
  }

  /* any other same-origin file: cache first, refresh quietly in the background */
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
