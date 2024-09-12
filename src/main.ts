import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import App from "./App.vue";

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
});
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.mount("#app");
