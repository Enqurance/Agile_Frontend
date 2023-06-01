const {defineConfig} = require('@vue/cli-service')

const { VantResolver } = require('unplugin-vue-components/resolvers')
const ComponentsPlugin = require('unplugin-vue-components/webpack')

module.exports = defineConfig({
    transpileDependencies: true,

    productionSourceMap: false,
    devServer: {
        port: 8081,
    },

    configureWebpack: {
        plugins: [
            ComponentsPlugin({
                resolvers: [VantResolver()],
            })
        ]
    },
})
