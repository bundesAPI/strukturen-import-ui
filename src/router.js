import Vue from "vue";
import Router from "vue-router";
import OrgchartList from "./views/OrgchartList";
import * as AUTH from "./auth";
import Login from "./views/Login";
import "regenerator-runtime/runtime";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/orgchart/:id",
      name: "Orgchart",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Orgchart.vue"),
      beforeEnter(to, from, next) {
        if (AUTH.isLoggedIn() === true) {
          next();
        } else {
          next({
            name: "Login", // back to safety route //
          });
        }
      },
    },
    {
      path: "/",
      name: "Home",
      component: OrgchartList,
      beforeEnter(to, from, next) {
        if (AUTH.isLoggedIn() === true) {
          next();
        } else {
          next({
            name: "Login", // back to safety route //
          });
        }
      },
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/login/done",
      beforeEnter: async function (to, from, next) {
        await AUTH.loginCallback(window.location)
          .then(function () {
            next({ name: "Home" });
          })
          .catch(function () {
            next({ name: "Login" });
          });
      },
    },
  ],
});
