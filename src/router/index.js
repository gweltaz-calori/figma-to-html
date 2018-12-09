import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/components/Pages/Home.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "*", redirect: "/" }
];

export default new VueRouter({
  routes,
  mode: "history"
});
