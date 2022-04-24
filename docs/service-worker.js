/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "08a85ddaf754afb747480888032786ec"
  },
  {
    "url": "assets/css/0.styles.8d23166f.css",
    "revision": "d6bce2d12ffbef7004e8758b07c93728"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.0e342de7.js",
    "revision": "786c9b9aead5c0a7dc9d41b61ad9e3de"
  },
  {
    "url": "assets/js/11.4e99e542.js",
    "revision": "e2bab0bf345800dbfbba98319b4375a9"
  },
  {
    "url": "assets/js/12.aa0a7f00.js",
    "revision": "eb456359551710cf466f941a8417922d"
  },
  {
    "url": "assets/js/13.a8654106.js",
    "revision": "7d33ea42c1bcd425e338e7841f4937f3"
  },
  {
    "url": "assets/js/14.d06bd552.js",
    "revision": "68b52ebc1f87241e54fbb212c73308a5"
  },
  {
    "url": "assets/js/15.cedc7442.js",
    "revision": "8454efc03bca1a153972636c29deef22"
  },
  {
    "url": "assets/js/16.b2c27a43.js",
    "revision": "b243954d7d370b70254fb53ed3b4fde4"
  },
  {
    "url": "assets/js/17.d911f3b1.js",
    "revision": "a008384933e28e96a23c2337f1c58b4c"
  },
  {
    "url": "assets/js/18.1f09779e.js",
    "revision": "e4cd920145c7b0479c739b05fedde093"
  },
  {
    "url": "assets/js/2.b2fb1f10.js",
    "revision": "9d327b5d39bad3e0b39f1d0e18817be5"
  },
  {
    "url": "assets/js/3.e46bb504.js",
    "revision": "027f632732a34da75987dd7a9074111f"
  },
  {
    "url": "assets/js/4.2474e0d7.js",
    "revision": "983413a0bbf0d5c657a05698d8e41ec9"
  },
  {
    "url": "assets/js/5.6e7fba28.js",
    "revision": "6c63eb7167f560be82d0ae42a28365ef"
  },
  {
    "url": "assets/js/6.7ee048c2.js",
    "revision": "21a9e1743c72ffcf98a66f022fcec5c8"
  },
  {
    "url": "assets/js/7.3995a2c7.js",
    "revision": "1f5b2dbcb899e88572d7d453edaff492"
  },
  {
    "url": "assets/js/8.58d457ad.js",
    "revision": "65a9d5e70eeb59f78017bfa33bda1446"
  },
  {
    "url": "assets/js/9.8d4ef6eb.js",
    "revision": "44b2c298ade6d06544bbf21aefc5d296"
  },
  {
    "url": "assets/js/app.dd617e73.js",
    "revision": "71b5ee598c9b1e9f3078fd0a423f5b0b"
  },
  {
    "url": "cli/index.html",
    "revision": "dc9c5bae5d9aa9ea38ac6ca932bc8112"
  },
  {
    "url": "code_icon.svg",
    "revision": "6d98499759b559d01435233821085530"
  },
  {
    "url": "de/cli/index.html",
    "revision": "07bb2da64fc78798a76a510fd9307d97"
  },
  {
    "url": "de/files/index.html",
    "revision": "8e001c2a0d9b443c8bdaff407ddf6ef6"
  },
  {
    "url": "de/guide/index.html",
    "revision": "692334514e2f4f07dabf644e3128e744"
  },
  {
    "url": "de/ides/index.html",
    "revision": "d538d079154f3b184390eee9b591b57d"
  },
  {
    "url": "de/index.html",
    "revision": "595519e515f0c925a82b81551516cf09"
  },
  {
    "url": "de/syntax/index.html",
    "revision": "d3b8cb066b6bafa15a66ee61d77b63df"
  },
  {
    "url": "documentation_icon.svg",
    "revision": "e79144aeba2ed0b4794f1929ede7b77f"
  },
  {
    "url": "files/index.html",
    "revision": "4b027078722348a89e16814d9d0ab456"
  },
  {
    "url": "gitHub_icon.svg",
    "revision": "7b05157c10cc87d9701fc1c014e243e9"
  },
  {
    "url": "guide/index.html",
    "revision": "f53a14b0926c6d6a8e2265c64242f015"
  },
  {
    "url": "icons/icon-128x128.png",
    "revision": "60e9939ac56bdfd9be858eecb6932eff"
  },
  {
    "url": "icons/icon-144x144.png",
    "revision": "606023595d20a2cba27c58092f66fa77"
  },
  {
    "url": "icons/icon-152x152.png",
    "revision": "2f133d6d82a6deabf3648144670dfc83"
  },
  {
    "url": "icons/icon-192x192.png",
    "revision": "9a3ad965cf4a4724ecc863854339137d"
  },
  {
    "url": "icons/icon-384x384.png",
    "revision": "d8cba6bbef4b6335fdd9e677b2597098"
  },
  {
    "url": "icons/icon-512x512.png",
    "revision": "d8cba6bbef4b6335fdd9e677b2597098"
  },
  {
    "url": "icons/icon-72x72.png",
    "revision": "6d0ee3d29a1e0cb1884d64b265295af2"
  },
  {
    "url": "icons/icon-96x96.png",
    "revision": "6f495e0ba2287254eab43c84654ca9ca"
  },
  {
    "url": "ides/index.html",
    "revision": "8a0c3e5fd28acf681428d519121d4b39"
  },
  {
    "url": "index.html",
    "revision": "cf3b7058ca15d8d5b7c3d1be4b6f57c4"
  },
  {
    "url": "logo.png",
    "revision": "95147fc4d8ba6f83170fb6926d27d3da"
  },
  {
    "url": "rocket_icon.svg",
    "revision": "128d0d41795506a985f62b9334d0eb90"
  },
  {
    "url": "syntax/index.html",
    "revision": "bc49950e29a6c0aac25d76a71734c534"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
