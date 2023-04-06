import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import  { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.css'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router/index'
import api from "./plugins/axios";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';



const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App).use(router).use(vuetify).use(createPinia())
app.component('EasyDataTable', Vue3EasyDataTable);
app.provide('api', api)
app.mount('#app')




