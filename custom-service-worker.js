// the cache version gets updated every time there is a new deployment
let CACHE_VERSION = 10;
const CURRENT_CACHE = `main-`;
const reg = new RegExp("^(http|https)://", "i");
const mediaUrlRegEx = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;
const staticReg = /^https?:\/\/.*[\\\/].+\.chunk.js$/;
const cacheApi = [
  "https://base-api-t3e66zpola-uk.a.run.app/",
  "https://followers-table-t3e66zpola-ez.a.run.app/",
  "https://show-market-items-t3e66zpola-ue.a.run.app/",
  "https://get-doc-t3e66zpola-uc.a.run.app/",
  "https://transaction-hist-t3e66zpola-uc.a.run.app/",
  "https://show-feed-t3e66zpola-uc.a.run.app/",
];

// these are the routes we are going to cache for offline support
const cacheFiles = [
  "/",
  "/asset-manifest.json",
  "/custom-service-worker.js",
  "/favicon.png",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
  "/16x16.png",
  "/24x24.png",
  "/32x32.png",
  "/64x64.png",
  "/192x192.png",
  "/512x512.png",
  "/index.html",
  "/offline.html",
  "/static/js/bundle.js",
  "/static/js/vendors~main.chunk.js",
  "/static/js/main.chunk.js",
  "/static/js/2.7973854f.chunk.js",
  "/static/js/main.6260d7d0.chunk.js",
  "/static/js/runtime-main.72b5b8f8.js",
  "/static/css/2.3fd7d989.chunk.css",
  "/static/css/main.9bba949c.chunk.css",
  "/static/media/blackjack-120.f8d95ade.png",
  "/static/media/Blackjack.62ff1f53.png",
  "/static/media/logo.9f5189da.png",
  "/static/media/logo1.c598593a.png",
  "/static/media/Webp.net-gifmaker.b324acdc.gif",
  "/static/media/shop_market.3006f50f.png",
  "/static/media/Rolling-2.6s-88px (1).66644d42.gif",
  "/static/media/profile.924f260d.jpg",
  "/static/media/playing cards release.6e562d92.mp3",
  "/static/media/playing card slide.fa57aada.mp3",
  "/static/media/market place spell.6d67f47e.mp3",
  "/static/media/logocoin.1627ed13.png",
  "/static/media/level-up.6a14d059.mp3",
  "/static/media/DiceLVsmall.2845c8fb.gif",
  "/static/media/DiceLV.2845c8fb.gif",
  "/static/media/coins.46f4f7a4.mp3",
  "/static/media/coins-7.cc47dc25.png",
  "/static/media/coins-6.131c2148.png",
  "/static/media/coins-5.05539b14.png",
  "/static/media/coins-4.df8cdf7c.png",
  "/static/media/coins-3.b742e8e0.png",
  "/static/media/coins-2.27ef3a8d.png",
  "/static/media/coins-1.e7cf49ff.png",
  "/static/media/check.e0f75101.png",
  "/static/media/Cash play.9f6eaf57.png",
  "/static/media/card button.6145e72d.mp3",
  "/static/media/poker-120.fd3a3ca1.png",
];

// on activation we clean up the previously registered service workers
this.addEventListener("activate", (evt) =>
  evt.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CURRENT_CACHE + CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  )
);

// on install we download the routes we want to cache for offline
this.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CURRENT_CACHE + CACHE_VERSION).then((cache) => {
      return cache.addAll(cacheFiles);
    })
  );
});

// fetch the resource from the network
const fromNetwork = (evt) => {
  return fetch(evt.request)
    .then(function (response) {
      let responseClone = response.clone();
      if (
        (cacheApi.find((el) => evt.request.url.search(el) !== -1) ||
          staticReg.test(evt.request.url) ||
          mediaUrlRegEx.test(evt.request.url)) &&
        evt.request.url.search(
          "https://blackjack-server-t3e66zpola-uc.a.run.app/"
        ) === -1
      ) {
        evt.waitUntil(
          caches.open(CURRENT_CACHE + CACHE_VERSION).then(function (cache) {
            cache.put(evt.request, responseClone);
          })
        );
      }
      return response;
    })
    .catch(function (err) {
      return fromCache(evt);
    });
};

// fetch the resource from the browser cache
const fromCache = (evt) => {
  return caches
    .open(CURRENT_CACHE + CACHE_VERSION)
    .then((cache) =>
      cache.match(evt.request).then((matching) => {
        if (matching) {
          return matching;
        } else {
          if (
            evt.request.url.search(
              "https://blackjack-server-t3e66zpola-uc.a.run.app/"
            ) !== -1
          ) {
            throw Error;
          }
          return caches.match("/index.html");
        }
      })
    )
    .catch((err) => {
      if (
        evt.request.url.search(
          "https://blackjack-server-t3e66zpola-uc.a.run.app/"
        ) !== -1
      ) {
        throw Error;
      }
      return caches.match("/index.html");
    });
};

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
this.addEventListener("fetch", function (event) {
  if (reg.test(event.request.url)) {
    event.respondWith(fromNetwork(event));
  } else {
    fromCache(event);
  }
});
