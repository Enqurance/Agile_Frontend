import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import '../../node_modules/element-plus/theme-chalk/index.css'

// 全局注册 Element Plus
const app = createApp({});
app.use(ElementPlus);

