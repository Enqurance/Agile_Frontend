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
app.config.globalProperties.$device = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
) ? "mobile" : "pc"


app.mount('#app')
