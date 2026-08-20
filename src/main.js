import { createApp } from 'vue'

import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'

import router from './router'


import './assets/main.css'


const app = createApp(App)



// 创建 Pinia
const pinia = createPinia()


// 开启 Pinia 持久化插件
// 用于保存分析结果、历史记录等数据
pinia.use(
  piniaPluginPersistedstate
)



// 注册 Pinia
app.use(pinia)


// 注册 Vue Router
app.use(router)



// 挂载应用
app.mount('#app')