import axios from 'axios';

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'animesur',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.9.4/css/bulma.min.css' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.1.3/axios.min.js' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  generate: {
    async routes() {
      const animeUrls = await axios.get('http://localhost:1111/items/Trailers')
        .then((res) => res.data.data.map((anime) => {
          return `/anime/${anime.id}`
        }));

      const pageUrls = await axios.get('http://localhost:1111/items/Trailers?aggregate[count]=*')
        .then(res => {
          const total = Math.ceil(res.data.data[0].count / 12);
          const pages = [];

          for (let i = 1; i<= total; i++) {
            pages.push(`/page/${i}`);
          }

          return pages;
        });

      return [...animeUrls, ...pageUrls];
    }
  }
}
