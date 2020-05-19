var urlsToCache = [
  "/",
  "/manifest.json",
  "/nav.html",
  "/index.html",
  "/pages/home.html",
  "/pages/kuliner.html",
  "/pages/budaya.html",
  "/pages/alam.html",
  "/css/materialize.min.css",
  "/css/materialize.css",
  "/css/style.css",
  "/js/materialize.js",
  "/js/materialize.min.js",
  "/js/nav.js",
  "/images/icons/icon-72x72.png",
  "/images/icons/icon-96x96.png",
  "/images/icons/icon-128x128.png",
  "/images/icons/icon-144x144.png",
  "/images/icons/icon-152x152.png",
  "/images/icons/icon-192x192.png",
  "/images/icons/icon-384x384.png",
  "/images/icons/icon-512x512.png",
  "/images/banner/1.jpg",
  "/images/banner/2.jpg",
  "/images/banner/3.jpg",
  "/images/banner/4.jpg",
  "/images/banner/5.jpg",
  "/images/makanan/1.png",
  "/images/makanan/2.png",
  "/images/makanan/3.png",
  "/images/makanan/4.jpg"
];

const CACHE_NAME = "wisata-v6";

self.addEventListener("install", function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function(){
  console.log("Installing web app");
  return caches.open(CACHE_NAME).then(function(cache) {
    console.log("caching index and important routes");
    return cache.addAll(urlsToCache);
  });
};

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName != CACHE_NAME) {
            console.log("ServiceWorker: cache " + cacheName + " dihapus");
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches
    .match(event.request, {
      cacheName: CACHE_NAME
    })
    .then(function (response) {
      if (response) {
        console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
        return response;
      }

      console.log(
        "ServiceWorker: Memuat aset dari server: ",
        event.request.url
      );
      return fetch(event.request);
    })
    .catch(function(err) {       // fallback mechanism
      console.log(err)
    })
  );
});

       