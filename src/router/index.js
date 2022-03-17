import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/exit",
      component: () => import("../exitMap.vue")
    },
    {
      path: "/map",
      component: () => import("../map.vue")
    },
    {
      path: "/seemap",
      component: () => import("../seemap.vue")
    },
    {
      path: "/fuMap",
      component: () => import("../fuMap.vue")
    },
    {
      path: "/openlayer",
      component: () => import("../openlayer.vue")
    },
    {
      path: "/circle",
      component: () => import("../circle.vue")
    },
  ]
});
