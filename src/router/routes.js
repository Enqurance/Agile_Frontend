import InforPage from "@/components/InforPage.vue";
import MapHomepage from '../components/MapHomepage.vue'
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import MyPost from "@/components/sub_components/infopage_sub_components/MyPost.vue";
import MyComment from "@/components/sub_components/infopage_sub_components/MyComment.vue";
import MyMessage from "@/components/sub_components/infopage_sub_components/MyMessage.vue";
import ForumPage from "@/components/ForumPage.vue";
import AdministratorPage from "@/components/AdministratorPage.vue";
import PostPage from "@/components/PostPage.vue";

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
        name: 'forum',
        path: '/Forum',
        component: ForumPage,
    },
    {
        name: 'post',
        path: '/Forum/:postID',
        component: PostPage,
    },
    {
        name: 'Administrator',
        path: '/Administrator',
        component: AdministratorPage,
    },
]

export default routes