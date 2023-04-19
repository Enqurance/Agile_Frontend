import { createApp } from 'vue'
import App from './App.vue'
import router from "./router/index.js";
import axiosInstance from "./axios/axios.js";

import VueCookies from 'vue-cookies'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

const app = createApp(App)

app.use(router)
app.use(VueCookies)
app.use(ElementPlus)

app.config.globalProperties.$axios = axiosInstance
app.config.globalProperties.$router = router

app.mount('#app')
