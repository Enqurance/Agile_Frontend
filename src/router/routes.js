import InforPage from "@/components/InforPage.vue";
import MapHomepage from '../components/MapHomepage.vue'
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import ForumPage from "@/components/ForumPage.vue";
import AdministratorPage from "@/components/AdministratorPage.vue";
import PostPage from "@/components/PostPage.vue";
import IntroPage from "@/components/IntroPage.vue";
import MobileIntroPeople from "@/components/mobile/sub_components/intropage_sub_components/MobileIntroPeople.vue"

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
    {
        name: 'post',
        path: '/Forum/:postID',
        component: PostPage,
        props: true,
    },
    {
        name: 'Administrator',
        path: '/Administrator',
        component: AdministratorPage,
    },
    {
        name: 'intro',
        path: '/Intro',
        component: IntroPage,
    },
    {
        name: 'introFeat',
        path: '/IntroFeat',
        component: IntroPage,
    },
    {
        name: 'introPeople',
        path: '/IntroPeople',
        component: MobileIntroPeople,
    },
]

export default routes