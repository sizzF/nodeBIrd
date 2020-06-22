module.exports = {
    head: {
        title: 'NodeBird',
        meta: [{
            charset: 'utf-8',
          }, {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          }, {
            'http-equiv': 'X-UA-Compatible', content: 'IE=edge',
          }, {
            hid: 'desc', name: 'description', content: 'sizzF의 NodeBird SNS',
          }, {
            hid: 'ogtitle', name: 'og:title', content: 'NodeBird',
          }, {
            hid: 'ogdesc', name: 'og:description', content: 'sizzF의 NodeBird SNS',
          }, {
            hid: 'ogtype', property: 'og:type', content: 'website',
          }, {
            hid: 'ogimage', property: 'og:image', content: 'https://vue.nodebird.com/vue-nodebird.png',
          }, {
            hid: 'ogurl', property: 'og:url', content: 'https://vue.nodebird.com',
          }],
          link: [{ rel: 'shortcut icon', href: '/vue-nodebird.png' }],
          
    },
    modules: [
        '@nuxtjs/axios',
    ],
    buildModules: [
        '@nuxtjs/vuetify',
        '@nuxtjs/moment'
    ],
    pulgins: [],
    vuetify: {},
    axios: {
        browserBaseURL: 'http://localhost:3085',
        baseURL: 'http://localhost:3085',
        https: false,
    },
    moment: {
        locales: ['ko'],
    },
    build: {
        extend(config, { isClient, isServer, isDev }){
            if(isServer && !isDev){
                config.devtool = 'hidden-source-map';
            }
            console.log('webpack', config, isClient, isServer);

        }
    },
    server: {
        port: process.envPORT || 3088,
    },
};