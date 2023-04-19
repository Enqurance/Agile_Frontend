import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
<<<<<<< HEAD
import global_token from '../global.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
=======
import global from '../global.js' 
import VueCookies from 'vue-cookies';

const router = createRouter({
    history: createWebHistory(),
    routes,
>>>>>>> ea63b15a13960284d366f10d94ea0b2c5f2120aa
})

router.beforeEach((to, from, next) => {
  //to代表要去的路径
  //from表示原来的路径
  //next()通行
  //验证token,只有存在token的时候，才能跳转到内容页
<<<<<<< HEAD
  let token = global_token.global_token;
  console.log("token: ", token);
  if ( token == '' && (to.path == "/InforPage" || to.path == "/MapHomePage")) {
    next("/login");
  } else {
=======
  let token = VueCookies.get('user_token');
  console.log("token: ", token);
  // todo token == ''好像会判断失误
  if ( token == '' && (to.path == "/InforPage" || to.path == "/Map")) {
    next("/login");
  } else { 
>>>>>>> ea63b15a13960284d366f10d94ea0b2c5f2120aa
    next();
  }
});

export default router
