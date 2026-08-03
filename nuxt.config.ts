export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/image"],
  components: [
    {
      path: '~/sections/homepage',
      pathPrefix: false,
      global: true,
    },
    {
      path: '~/components/ui',
      pathPrefix: false,
      global: true,
    },
  ],
  image: {
    dir: "assets/images",
  },
  app: {
    head: {
      title: "ATM Automation",
      meta: [
        { name: "description", content: "ATM Automation" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preload", href: "/fonts/NEUEMONTREAL-REGULAR.OTF", as: "font", type: "font/otf", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/NEUEMONTREAL-MEDIUM.OTF", as: "font", type: "font/otf", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/PPFRAKTIONMONO-BOLD-BF675904A6C4C6E.OTF", as: "font", type: "font/otf", crossorigin: "anonymous" },
      ],
    },
  },
  typescript: {
    shim: false,
  },
  experimental: {
    reactivityTransform: true,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "~/assets/scss/_variables.scss" as *;
            @use "~/assets/scss/_responsive.scss" as *;
          `,
        },
      },
    },
  },
  css: ["~/assets/scss/global.scss", "~/assets/scss/_semantic.scss"],
});
