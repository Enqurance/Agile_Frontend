import InforPage from "@/components/InforPage.vue";
import MapHomepage from '../components/MapHomepage.vue'
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import ForumPage from "@/components/ForumPage.vue";

const routes = [
    {
        name: 'home',
        path: '/',
        component: MapHomepage
    },
    {
        name: 'map',
        path: '/home',
        component: MapHomepage
    },
    {
        name: 'InforPage',
        path: '/InforPage',
        component: InforPage,
    },
    {
        name: 'login',
        path: '/login',
        component: LoginPage,
    },
    {
        name: 'register',
        path: '/register',
        component: RegisterPage,
    },
    {
        name: 'forum',
        path: '/Forum',
        component: ForumPage,
    },
]

export default routes