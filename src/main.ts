import { createApp } from 'vue'
import './style.css'
import "./assets/icon.css"
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入Pinia
import { createPinia } from 'pinia'

import router from './router/index'

let app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


let pinia = createPinia()
// 安装Pinia
app.use(pinia)

app.use(router)
app.mount('#app')


