import InforPage from "@/components/InforPage.vue";
import MapHomepage from '../components/MapHomepage.vue'
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
<<<<<<< HEAD
import MyPost from "@/components/MyPost";
import MyComment from "@/components/MyComment";
import ForumPage from "@/components/ForumPage.vue";
import MyMessage from "@/components/MyMessage";
=======
import ForumPage from "@/components/ForumPage.vue";
>>>>>>> 6dc169b ([feat]():init forumPage)

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
<<<<<<< HEAD
        name: 'myPost',
        path: '/InforPage/myPost',
        component: MyPost,
    },
    {
        name: 'myComment',
        path: '/InforPage/myComment',
        component: MyComment,
    },
    {
        name: 'myComment',
        path: '/InforPage/myMessage',
        component: MyMessage,
    },
    {
=======
>>>>>>> 6dc169b ([feat]():init forumPage)
        name: 'forum',
        path: '/Forum',
        component: ForumPage,
    },
]

export default routes