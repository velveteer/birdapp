<template>
  <el-col align="middle" :xs="24" :sm="8" :md="8" :lg="8" :xl="8" :key="bird.name">
    <el-card :class="cardClass">
      <div class="block">
        <el-avatar fit="fill" :size="100" :src="bird.picture"></el-avatar>
      </div>
      <div style="padding-top: 20px;">
        <span>{{ bird.name }}</span>
        <div class="bird-event">{{ latestLogEntry }}</div>
        <div>
          <el-popover
            @hide="resetSignOutReason"
            placement="bottom"
            title="Sign Out Reason"
            width="250"
            v-model="popOverVisible"
            trigger="manual">
            <el-button slot="reference"
                       v-show="!bird.isSignedOut"
                       class="button sign-button"
                       @click="popOverVisible = !popOverVisible"
                       style="margin-top: 10px;"
                       type="primary">
              Sign Out
            </el-button>
            <slot>
            <el-select v-model="signOutReason" placeholder="Select">
              <el-option
                v-for="item in signOutOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input
              v-if="signOutReason === signOutConstants.WALK"
              type="input"
              placeholder="Your name"
              style="margin-top: 10px;"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="signOutUser">
            </el-input>
            <el-input
              v-if="signOutReason === signOutConstants.OTHER"
              type="textarea"
              style="margin-top: 10px;"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="signOutNote">
            </el-input>
            <el-button class="button"  @click="signOut" style="margin-top: 10px;" type="primary">
              Submit
            </el-button>
            </slot>
          </el-popover>
          <el-button class="button sign-button" v-if="bird.isSignedOut" style="margin-top: 10px;" @click="signIn" type="primary">
            Sign In
          </el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import dayjs from 'dayjs'
import { SIGNOUT_OPTIONS } from '../constants'

export default {
  name: 'BirdCard',
  props: {
    bird: Object
  },
  computed: {
    cardClass() {
      const css = {
        'bird-card': true,
      }
      if (this.bird.isSignedOut) {
        css['bird-card--dimmed'] = true
      }
      return css
    },
    latestLogEntry() {
      const entry = this.bird.log.concat().pop()
      if (entry) {
        return `Last ${entry.event} on ${dayjs(entry.time).format('MMM D, h:mma')}`
      }
      return null;
    },
  },
  data() {
    return {
      popOverVisible: false,
      signOutReason: '',
      signOutNote: '',
      signOutUser: '',
      signOutConstants: SIGNOUT_OPTIONS,
      signOutOptions: Object.values(SIGNOUT_OPTIONS).map(x => ({ label: x, value: x }))
    }
  },
  methods: {
    resetSignOutReason() {
      this.signOutReason = null
      this.signOutNote = null
      this.signOutUser = null
    },
    signOut() {
      if (this.signOutReason === SIGNOUT_OPTIONS.OTHER && this.signOutNote) {
        this.$store.commit('signOutBird', { bird: this.bird, reason: this.signOutNote })
        this.popOverVisible = false
        return
      }
      if (this.signOutReason === SIGNOUT_OPTIONS.WALK && this.signOutUser) {
        this.$store.commit('signOutBird', { bird: this.bird, reason: this.signOutReason, user: this.signOutUser })
        this.popOverVisible = false
        return
      }
      if (this.signOutReason && this.signOutReason !== SIGNOUT_OPTIONS.OTHER && this.signOutReason !== SIGNOUT_OPTIONS.WALK) {
        this.$store.commit('signOutBird', { bird: this.bird, reason: this.signOutReason })
        this.popOverVisible = false
        return
      }
    },
    signIn() {
      this.$store.commit('signInBird', this.bird)
    },
  },
}
</script>

<style>
.el-col {
  margin-bottom: 20px;
}
.el-avatar>img {
  width: 100%;
}
.el-select {
  display: block !important;
}
.sign-button {
  width: 100px;
}
.bird-card {
  transition: all 0.5s;
  height: 280px !important;
}
.bird-card--dimmed {
  background-color: #eee !important;
  transition: all 0.5s;
}
.bird-card--dimmed img {
  transition: opacity 0.5s;
  opacity: 0.7;
}
.bird-event {
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  padding: 8px;
  margin-bottom: 8px;
}
.signout-form {
  height: 100px !important;
}
</style>
