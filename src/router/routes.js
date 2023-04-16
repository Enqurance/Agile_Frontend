import InforPage from '../components/InforPage.vue'
import login from '../components/login.vue'
import register from '../components/register.vue'
import MapHomePage from '../components/MapHomePage.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        component: MapHomePage
    },
    { 
        name: 'InforPage',
        path: '/InforPage', 
        query:{} ,
        component: InforPage,
    },
    {
        name: 'login',
        path: '/login',
        component: login,
    },
    {
        name: 'register',
        path: '/register',
        component: register,
    },
    {
        name: 'MapHomePage',
        path: '/MapHomePage',
        component: MapHomePage,
    }
]

export default routes