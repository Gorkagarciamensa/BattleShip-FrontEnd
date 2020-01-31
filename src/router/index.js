import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },

  {
    path: "/Game/:id",
    name: "grid",
    props: true,
    component: () => import("../views/Game.vue")
  },
  {
    path: "/Ladderboard",
    name: "ladderboard",
    component: () => import("../views/Ladderboard.vue")
  },
  {
    path: "/Login",
    name: "login",
    component: () => import("../views/Login.vue")
  },
  {
    path: "/Register",
    name: "register",
    component: () => import("../views/Register.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
