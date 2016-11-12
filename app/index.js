import EVA from 'eva.js'
import App from './components/App'

import initializeStore from './store/app'

import Overview from './components/pages/Overview'
import Devices from './components/pages/Devices'

const app = new EVA({ mode: 'history' })

initializeStore(app)

app.router(route => [
  { meta: { title: "Vue d'ensemble" }, ...route('/', Overview) },
  { meta: { title: 'Périphériques' }, ...route('/peripheriques', Devices) },
  { path: '*', redirect: '/' }
])

app.$router.afterEach((to, from) => {
  document.title = `${to.meta.title} - Homie Dashboard`
})

app.start(App, '#app')
