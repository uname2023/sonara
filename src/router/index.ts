import { createRouter, createWebHistory } from "vue-router";
import main from "@/components/main/index.vue"
import recommend from "@/views/onlineMusic/recommend/index.vue"
import musicHall from "@/views/onlineMusic/musicHall/index.vue"
import myLike from "@/views/MyMusic/myLike/index.vue"
import recently from "@/views/MyMusic/recently/index.vue"
import playList from "@/views/playList/playList.vue"
import MVDetail from "@/views/MVDetail/index.vue"
import songerList from "@/views/songerList/index.vue"
import albumDetail from "@/views/album/albumDetail.vue"
const routes = [
  {
    path: "/",
    component: main,
    redirect: "/recommend",
    children: [
      { name: "recommend", path: "recommend", component: recommend },
      { name: "musicHall", path: "musicHall", component: musicHall },
      { name: "myLike", path: "myLike", component: myLike },
      { name: "recently", path: "recently", component: recently },
      { name: "playList", path: "playList", component: playList },
      { name: "MVdetail", path: "MVdetail", component: MVDetail },
      { name: "songerList", path: "songerList", component: songerList },
      { name: "albumDetail", path: "albumDetail", component: albumDetail },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(),//路由器的工作模式
  routes: routes,
})
router.beforeEach((to, from, next) => {
  next()
});
export default router;