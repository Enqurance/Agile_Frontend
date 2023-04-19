import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import global from "@/global";

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
  //to代表要去的路径
  //from表示原来的路径
  //next()通行
  //验证token,只有存在token的时候，才能跳转到内容页
  let token = global.global_token;
  console.log("token: ", token);
  if ( token == '' && (to.path === "/InforPage")) {
    next("/login");
  } else {
    next();
  }
});

export default router
