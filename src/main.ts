import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '../tokens/tokens.css'
import './styles/base.css'

// Router vor dem Mounten registrieren.
createApp(App)
  .use(router)
  .mount('#app')