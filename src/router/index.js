import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import global_token from '../global.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  //to代表要去的路径
  //from表示原来的路径
  //next()通行
  //验证token,只有存在token的时候，才能跳转到内容页
  let token = global_token.global_token;
  console.log("token: ", token);
  if ( token == '' && (to.path == "/InforPage" || to.path == "/MapHomePage")) {
    next("/login");
  } else {
    next();
  }
});

export default router
