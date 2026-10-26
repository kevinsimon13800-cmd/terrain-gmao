/* Hors connexion : tout est mis en cache a la premiere ouverture. Changer VERSION pour forcer la mise a jour. */
var VERSION = "terrain-v1";
var FICHIERS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    var reseau = fetch(e.request).then(function (resp) {
      if (resp && resp.ok) { var copie = resp.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); }); }
      return resp;
    }).catch(function () { return r; });
    return r || reseau;
  }));
});
