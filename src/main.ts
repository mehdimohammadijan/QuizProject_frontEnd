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




const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App).use(router).use(vuetify).use(createPinia())

app.provide('api', api)
app.mount('#app')




