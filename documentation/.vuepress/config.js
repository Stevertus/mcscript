module.exports = {
  title: "mcscript",
  description: "mcscript is a programming language for Minecraft.",
  head: [
    ["link", { rel: "icon", href: "/logo.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    ["meta", { name: "theme-color", content: "#86d286" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
    ["link", { rel: "apple-touch-icon", href: "/icons/icon-152x152.png" }],
    [
      "link",
      {
        rel: "mask-icon",
        href: "/icons/safari-pinned-tab.svg",
        color: "#86d286",
      },
    ],
    [
      "meta",
      { name: "msapplication-TileImage", content: "/icons/icon-144x144.png" },
    ],
    ["meta", { name: "msapplication-TileColor", content: "#1069b4" }],
  ],
  dest: "../docs",
  themeConfig: {
    sidebar: "auto",
    logo: "/logo.png",
    lastUpdated: "Last Updated",
    nav: [
      { text: "Guide", link: "/guide/" },
      { text: "CLI", link: "/cli/" },
      { text: "File System", link: "/files/" },
      { text: "Syntax", link: "/syntax/" },
      { text: "IDEs", link: "/ides/" },
    ],

    locales: {
      "/": {
        selectText: "English",
        label: "English",
        lastUpdated: "Last Updated",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh",
          },
        },
      },
      "/de/": {
        selectText: "Deutsch",
        label: "Deutsch",
        lastUpdated: "Zuletzt geändert",
        serviceWorker: {
          updatePopup: {
            message: "Neuer Inhalt ist verfügbar.",
            buttonText: "Refresh",
          },
        },
      },
    },
  },
  locales: {
    "/": {
      lang: "en-US",
      title: "mcscript",
      description: "mcscript is a programming language for Minecraft.",
    },
    "/de/": {
      lang: "de-DE",
      title: "mcscript",
      description: "mcscript ist eine Programmiersprache für Minecraft",
    },
  },
  plugins: [
    "@vuepress/last-updated",
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
  ],
};
