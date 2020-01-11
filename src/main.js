import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from "vuex-persistedstate";
import VueRouter from 'vue-router'
import App from './App.vue'
import BirdCreate from './components/BirdCreate.vue'
import BirdList from './components/BirdList.vue'
import BirdLog from './components/BirdLog.vue'
import './plugins/element.js'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'

dayjs.extend(dayOfYear)

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
    persistedState({
      key: 'birdapp_birds',
      paths: [
        'birds',
      ]
    }),
    persistedState({
      key: 'birdapp_logs',
      paths: [
        'log',
      ]
    })
  ],
  state: {
    birds: {},
    log: [],
  },
  getters: {
    birdList: state => Object.values(state.birds)
  },
  mutations: {
    addBird (state, bird) {
      bird.id = Object.keys(state.birds).length + 1
      bird.isSignedOut = false
      Vue.set(state.birds, bird.id, bird)
    },
    signInBird (state, bird) {
      const b = state.birds[bird.id]
      const now = dayjs().format();
      const entry = {
        bird: bird.id,
        event: 'Sign In',
        time: now
      }
      state.log.push(entry)
      if (b) {
        Vue.set(b, 'isSignedOut', false)
      }
    },
    signOutBird (state, { bird, reason, user }) {
      const b = state.birds[bird.id]
      const now = dayjs().format();
      const entry = {
        bird: bird.id,
        event: 'Sign Out',
        reason,
        user,
        time: now
      }
      state.log.push(entry)
      if (b) {
        Vue.set(b, 'isSignedOut', true)
      }
    },
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
