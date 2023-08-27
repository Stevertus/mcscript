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
    "revision": "8bca4dac8dd9e5c03e513db3fcdbf44c"
  },
  {
    "url": "assets/css/0.styles.8fb87093.css",
    "revision": "0f024c2e802a66918595abfc376507a1"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/1.5479b213.js",
    "revision": "981f5ea22c3775d5ed5f9515afaee2bb"
  },
  {
    "url": "assets/js/10.8b540692.js",
    "revision": "2a9cd717aba9d28e2a42d17601dd7e4f"
  },
  {
    "url": "assets/js/11.0ed310e9.js",
    "revision": "50293d0ee5b6173cc353241b7a841577"
  },
  {
    "url": "assets/js/12.9c113e20.js",
    "revision": "766bdfb58881601ba1170cc484fe1518"
  },
  {
    "url": "assets/js/13.d369c8ce.js",
    "revision": "e22d70d4791800c409c1750d39751f8f"
  },
  {
    "url": "assets/js/14.7ad13bec.js",
    "revision": "e8cad1f6f2498d78b1b8917092feab63"
  },
  {
    "url": "assets/js/15.23e5a4b1.js",
    "revision": "5edc11b6818d54525ef58a5a3dd24c53"
  },
  {
    "url": "assets/js/16.aff869ed.js",
    "revision": "e6b369ab06e6e3ff368281c03e68a7ab"
  },
  {
    "url": "assets/js/17.ee31f493.js",
    "revision": "ae48fd2360fb1cdfc4905b7fc69bb92f"
  },
  {
    "url": "assets/js/18.6835bd74.js",
    "revision": "1fb9b90c39cabdef672a39ed18ce4963"
  },
  {
    "url": "assets/js/19.45b387b0.js",
    "revision": "d9e5d6ecabca90c777715fa09f8b3858"
  },
  {
    "url": "assets/js/2.d6bda53c.js",
    "revision": "a93c3970899d6e4eddc1c2cd088b681d"
  },
  {
    "url": "assets/js/20.1738fba5.js",
    "revision": "fd5300cf1d7e09306e369e80e934e40b"
  },
  {
    "url": "assets/js/21.4d692b32.js",
    "revision": "5ef6d3c4e2e5a7c91d029665edeb38f2"
  },
  {
    "url": "assets/js/22.1731b443.js",
    "revision": "2d075e9cc0e2871ed70ace0e1e9409ad"
  },
  {
    "url": "assets/js/23.20d2c32d.js",
    "revision": "95dad76fd02ef2b3398d2bba59294060"
  },
  {
    "url": "assets/js/24.b1ba9dd1.js",
    "revision": "81f321e9e6517cf77c8929453b938861"
  },
  {
    "url": "assets/js/25.67a04e6a.js",
    "revision": "b5ec9392353d5eee0224be01e10f5475"
  },
  {
    "url": "assets/js/26.392aa713.js",
    "revision": "9418f4d8d8b94cf1cd34f717408e7f54"
  },
  {
    "url": "assets/js/27.e7f229ed.js",
    "revision": "a81a1624b77212111dc282d617d5a3e0"
  },
  {
    "url": "assets/js/28.c07ad597.js",
    "revision": "234b56538d87312f9f7909cba78472ea"
  },
  {
    "url": "assets/js/29.5b2137c1.js",
    "revision": "a3074812fd0772121cb16a1bcdb8d9b1"
  },
  {
    "url": "assets/js/3.f5aa00b7.js",
    "revision": "1021c2e521a68bf61947a3370480995c"
  },
  {
    "url": "assets/js/30.5ba13f75.js",
    "revision": "97f2b44c0098150c746f0d4362f4fc57"
  },
  {
    "url": "assets/js/31.05e43755.js",
    "revision": "f230f7a150aef3603814bbd31e1993e1"
  },
  {
    "url": "assets/js/32.1b6a87f1.js",
    "revision": "7cb93b9afd609d908a9cd0032e32959b"
  },
  {
    "url": "assets/js/33.6042f44a.js",
    "revision": "60eabee45a65c9637c05b05b32512db2"
  },
  {
    "url": "assets/js/34.1f5f89dd.js",
    "revision": "a9e6cbf43460f8890a78e7da4e261f43"
  },
  {
    "url": "assets/js/35.3514db4a.js",
    "revision": "2360ad202adc504e2884cfd3df889344"
  },
  {
    "url": "assets/js/4.e4be212d.js",
    "revision": "5bc970ee643f598fd3efabebcb1fb556"
  },
  {
    "url": "assets/js/5.65c44daf.js",
    "revision": "52e10948c2eb8e28d542adf98a5aeb6d"
  },
  {
    "url": "assets/js/6.734ecb4e.js",
    "revision": "77d35d09e7a6455e783bce48fa464e7d"
  },
  {
    "url": "assets/js/7.d77b33d9.js",
    "revision": "5c62e1b02479d947b90e4645d980ad8b"
  },
  {
    "url": "assets/js/app.85345d5f.js",
    "revision": "be7c8dbdc78fc300ca8a47607cb23f5e"
  },
  {
    "url": "assets/js/vendors~docsearch.03d43e08.js",
    "revision": "d5220e24c285820e35c659e1cd654c22"
  },
  {
    "url": "cli/index.html",
    "revision": "f854ecbee72f67d3d2511fea312e259e"
  },
  {
    "url": "code_icon.svg",
    "revision": "6d98499759b559d01435233821085530"
  },
  {
    "url": "de/cli/index.html",
    "revision": "cace93dd91b5317c6d879889c184aa51"
  },
  {
    "url": "de/files/index.html",
    "revision": "72882fb9d650a3d237c171f9c67115b8"
  },
  {
    "url": "de/guide/index.html",
    "revision": "65886c63736f95f33f2866070a50ba6d"
  },
  {
    "url": "de/ides/index.html",
    "revision": "bddeff0174a72e69f244d1a00039c99e"
  },
  {
    "url": "de/index.html",
    "revision": "c6178370de7a0fbf957440118d5a8147"
  },
  {
    "url": "de/syntax/index.html",
    "revision": "f82df33f11b92ee513f86b362dbd6217"
  },
  {
    "url": "documentation_icon.svg",
    "revision": "e79144aeba2ed0b4794f1929ede7b77f"
  },
  {
    "url": "files/index.html",
    "revision": "c7df2bcfa79187760b8a38423567911b"
  },
  {
    "url": "gitHub_icon.svg",
    "revision": "7b05157c10cc87d9701fc1c014e243e9"
  },
  {
    "url": "guide/index.html",
    "revision": "52ddccde8d745f827cbc96d7525e75fc"
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
    "revision": "523cdcdf50d0fdc5ee57c95a4031791a"
  },
  {
    "url": "index.html",
    "revision": "fa735d708c4a62fbb9a1587dbb92cb6a"
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
    "revision": "22b94a0d5f485325e90b7af50c6333cd"
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
