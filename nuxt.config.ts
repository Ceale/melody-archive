// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {
        enabled: false
    },
    modules: ["@bg-dev/nuxt-naiveui"],
    css: ["~/assets/css/g.css"],
    app: {
        rootTag: "body"
        // rootId: false
    },
    devServer: {
        port: 3300
    }
})
