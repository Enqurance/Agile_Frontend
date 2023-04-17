import InforPage from "@/components/InforPage.vue";
import MapHomepage from '../components/MapHomepage.vue'
import LoginView from "@/components/LoginView.vue";
import RegisterView from "@/components/RegisterView.vue";

const routes = [
    {
        name: 'home',
        path: '/',
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
        component: LoginView,
    },
    {
        name: 'register',
        path: '/register',
        component: RegisterView,
    },
    {
        name: 'MapHomePage',
        path: '/home',
        component: MapHomepage,
    }
]

export default routes