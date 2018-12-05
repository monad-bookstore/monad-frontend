const pkg = require('./package')
import webpack from 'webpack'
import createPersistedState from 'vuex-persistedstate'

const API_URL = process.env.NODE_ENV == 'production' ? 'http://91.211.246.132:5000' : 'http://localhost:5000';

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'MONAD.LT - Knygos',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Knygų parduotuvė internete' }
    ],
    link: [
      //{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:300,100,200,300' },
      { rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.5.0/css/all.css' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/global.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/client',
    '@/plugins/axios-bearer',
    { src: '@/plugins/localStorage.js', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    ['@nuxtjs/axios', {
      baseURL: API_URL
    }]
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    //proxy: true,
  },

  proxy: {
    //"/api/": "http://91.211.246.132:5000"
  },

  /*
  ** Build configuration
  */
  build: {
    plugins: [
      new webpack.ProvidePlugin({
          '_': 'lodash'
      })
    ],
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
