import Vue from 'vue'
import Vuex from 'vuex'
import { firestoreAction, vuexfireMutations } from 'vuexfire'
import VueRouter from 'vue-router'

import App from './App.vue'
import BirdCreate from './components/BirdCreate.vue'
import BirdEdit from './components/BirdEdit.vue'
import BirdList from './components/BirdList.vue'
import BirdLog from './components/BirdLog.vue'
import BirdManage from './components/BirdManage.vue'
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
    { path: '/edit', component: BirdEdit },
    { path: '/manage', component: BirdManage },
    { path: '/log', component: BirdLog },
    { path: '/login', component: Login },
  ]
})

router.beforeEach((to, from, next) => {
  if (!firebase.auth().currentUser && to.path !== '/login') next(`/login?next=${to.fullPath}`)
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
const FS_BIRDS = 'birds'
const FS_LOG = 'log'

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
          commit('signInUser', user)
          dispatch('initBinds')
        }
        commit('appLoaded')
      })
    },
    initBinds: firestoreAction(async ({ bindFirestoreRef }) => {
      await bindFirestoreRef('birds', db.collection(FS_BIRDS).where('isDeleted', '==', false))
      await bindFirestoreRef('log', db.collection(FS_LOG))
    }),
    addBird: firestoreAction((context, bird) => {
      const newBird = { ...bird, isSignedOut: false, isDeleted: false }
      return db.collection(FS_BIRDS).add(newBird)
    }),
    nextPath: ({ commit }, path) => {
      commit('setNextPath', path)
    },
    deleteBird: firestoreAction(async (context, bird) => {
      await db.collection(FS_BIRDS).doc(bird.id).update({ isDeleted: true })
    }),
    updateBird: firestoreAction(async (context, bird) => {
      const update = { name: bird.name }
      if (bird.picture) update.picture = bird.picture
      await db.collection(FS_BIRDS).doc(bird.id).update(update)
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
      db.collection(FS_LOG).add(entry)
      return db.collection(FS_BIRDS).doc(bird.id).update({ isSignedOut: true })
    }),
    signInBird: firestoreAction(async (context, bird) => {
      const now = dayjs().format();
      const entry = {
        bird: bird.id,
        event: 'Sign In',
        time: now,
        reason: null,
      }
      db.collection(FS_LOG).add(entry)
      return db.collection(FS_BIRDS).doc(bird.id).update({ isSignedOut: false })
    }),
  },
  getters: {
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

// firebase.auth().signOut()

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    this.$store.dispatch('initAuth')
  },
}).$mount('#app')


