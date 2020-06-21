module.exports = {
    head: {
        title: 'NodeBird',
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
        analyze: true,
        extend(config, { isClient, isServer, isDev }){
            if(isServer && !isDev){
                config.devtool = 'hidden-source-map';
            }
            console.log('webpack', config, isClient, isServer);

        }
    },
    server: {
        port: 3088,
    },
};