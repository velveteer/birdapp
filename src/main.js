import Vue from 'vue'
import Vuex from 'vuex'
import { firestoreAction, vuexfireMutations } from 'vuexfire'
import VueRouter from 'vue-router'

import App from './App.vue'
import BirdCreate from './components/BirdCreate.vue'
import BirdList from './components/BirdList.vue'
import BirdLog from './components/BirdLog.vue'
import Login from './components/Login.vue'

import dayjs from 'dayjs'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import './plugins/element.js'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: BirdList },
    { path: '/add', component: BirdCreate },
    { path: '/log', component: BirdLog },
    { path: '/login', component: Login },
  ]
})

router.beforeEach((to, from, next) => {
  if (!firebase.auth().currentUser && to.path !== '/login') next('/login')
  else next()
})

const firebaseConfig = {
  apiKey: "AIzaSyD7YtXVsadzWMKQqdN26_9BU13Ooy7wFbc",
  authDomain: "birdapp-3445b.firebaseapp.com",
  databaseURL: "https://birdapp-3445b.firebaseio.com",
  projectId: "birdapp-3445b",
  storageBucket: "birdapp-3445b.appspot.com",
  messagingSenderId: "629296176195",
  appId: "1:629296176195:web:dae04de33016db3f7a88f6"
}
const app = firebase.initializeApp(firebaseConfig)
const db = app.firestore()

const store = new Vuex.Store({
  state: {
    birds: [],
    log: [],
    loaded: false,
    user: null,
  },
  actions: {
    initAuth: ({ commit, dispatch }) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          dispatch('initBinds')
          commit('signInUser', user)
          router.push('/').catch(() => {})
        } else {
          router.push('/login').catch(() => {})
        }
        commit('appLoaded')
      })
    },
    initBinds: firestoreAction(async ({ bindFirestoreRef }) => {
      await bindFirestoreRef('birds', db.collection('birds'))
      await bindFirestoreRef('log', db.collection('log'))
    }),
    addBird: firestoreAction((context, bird) => {
      const newBird = { ...bird, isSignedOut: false }
      return db.collection('birds').add(newBird)
    }),
    signOutBird: firestoreAction(async (context, { bird, reason, user }) => {
      const now = dayjs().format();
      const entry = {
        bird: bird.id,
        event: 'Sign Out',
        reason,
        time: now
      }
      if (user) {
        entry.user = user
      }
      await db.collection('log').add(entry)
      await db.collection('birds').doc(bird.id).update({ isSignedOut: true })
    }),
    signInBird: firestoreAction(async (context, bird) => {
      const now = dayjs().format();
      const entry = {
        bird: bird.id,
        event: 'Sign In',
        time: now,
        reason: null,
      }
      await db.collection('log').add(entry)
      await db.collection('birds').doc(bird.id).update({ isSignedOut: false })
    }),
  },
  getters: {
    birdList: state => Object.values(state.birds),
    sortedLog: state => state.log.concat().sort((a, b) => {
      return dayjs(a.time).unix() - dayjs(b.time).unix()
    }),
  },
  mutations: {
    appLoaded(state) {
      state.loaded = true
    },
    signInUser(state, user) {
      state.user = user
    },
    ...vuexfireMutations,
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('initAuth')
  },
}).$mount('#app')


