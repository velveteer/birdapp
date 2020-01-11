import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import VueRouter from 'vue-router'
import App from './App.vue'
import BirdCreate from './components/BirdCreate.vue'
import BirdList from './components/BirdList.vue'
import BirdLog from './components/BirdLog.vue'
import './plugins/element.js'
import dayjs from 'dayjs'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: BirdList },
    { path: '/add', component: BirdCreate },
    { path: '/log', component: BirdLog },
  ]
})

const store = new Vuex.Store({
  plugins: [
    createPersistedState()
  ],
  state: {
    birds: {},
  },
  getters: {
    birdList: state => Object.values(state.birds)
  },
  mutations: {
    addBird (state, bird) {
      bird.id = Object.keys(state.birds).length + 1
      bird.isSignedOut = false
      bird.log = []
      Vue.set(state.birds, bird.id, bird)
    },
    signInBird (state, bird) {
      const b = state.birds[bird.id]
      const now = dayjs().format();
      const entry = {
        event: 'Sign In',
        time: now
      }
      if (b) {
        Vue.set(b, 'isSignedOut', false)
        Vue.set(b, 'log', b.log.concat(entry))
      }
    },
    signOutBird (state, { bird, reason, user }) {
      const b = state.birds[bird.id]
      const now = dayjs().format();
      const entry = {
        event: 'Sign Out',
        reason,
        user,
        time: now
      }
      if (b) {
        Vue.set(b, 'isSignedOut', true)
        Vue.set(b, 'log', b.log.concat(entry))
      }
    },
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
