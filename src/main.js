import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueKonva from "vue-konva";
import axios from "axios";
import VueAxios from "vue-axios";
import router from "./router";
import VJsf from "@koumoul/vjsf";
import "@koumoul/vjsf/dist/main.css";
import { createProvider } from "./vue-apollo";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

Vue.component("VJsf", VJsf);

Vue.use(VueKonva);
Vue.use(VueAxios, axios);

Sentry.init({
  Vue,
  dsn: process.env.VUE_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: [process.env.VUE_SENTRY_DOMAIN],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const _global =
  (typeof window !== "undefined" && window) ||
  (typeof global !== "undefined" && global) ||
  {};
_global.markdownit = require("markdown-it");

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
