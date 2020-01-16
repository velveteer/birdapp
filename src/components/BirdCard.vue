<template>
  <el-col align="middle" :xs="24" :sm="8" :md="8" :lg="8" :xl="8" :key="bird.name">
    <el-card :class="cardClass">
      <div class="block">
        <el-avatar fit="fill" :size="100" :src="bird.picture"></el-avatar>
      </div>
      <div style="padding-top: 20px;">
        <h3>{{ bird.name }}</h3>
        <div class="bird-event">{{ latestLogEntry }}</div>
        <div>
          <el-dialog
            title="Sign Out Reason"
            :fullscreen="true"
            :visible.sync="dialogVisible">
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelSignOut">Cancel</el-button>
              <el-button type="primary" @click="signOut">Confirm</el-button>
            </span>
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
          </el-dialog>
          <el-button slot="reference"
                     class="button sign-button"
                     @click="toggleSignOut"
                     style="margin-top: 10px;"
                     type="primary">
            <div v-show="!bird.isSignedOut">Sign Out</div>
            <div v-show="bird.isSignedOut">Sign In</div>
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
      const entry = this.$store.getters.sortedLog.filter(e => e.bird === this.bird.id).pop()
      if (entry) {
        return `Last ${entry.event} on ${dayjs(entry.time).format('MMM D, h:mma')}`
      }
      return null;
    },
  },
  data() {
    return {
      dialogVisible: false,
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
    cancelSignOut() {
      this.resetSignOutReason()
      this.dialogVisible = false
    },
    signOut() {
      if (this.signOutReason === SIGNOUT_OPTIONS.OTHER && this.signOutNote) {
        this.$store.dispatch('signOutBird', { bird: this.bird, reason: this.signOutNote })
        this.dialogVisible = false
        this.resetSignOutReason()
        return
      }
      if (this.signOutReason === SIGNOUT_OPTIONS.WALK && this.signOutUser) {
        this.$store.dispatch('signOutBird', { bird: this.bird, reason: this.signOutReason, user: this.signOutUser })
        this.dialogVisible = false
        this.resetSignOutReason()
        return
      }
      if (this.signOutReason && this.signOutReason !== SIGNOUT_OPTIONS.OTHER && this.signOutReason !== SIGNOUT_OPTIONS.WALK) {
        this.$store.dispatch('signOutBird', { bird: this.bird, reason: this.signOutReason })
        this.dialogVisible = false
        this.resetSignOutReason()
        return
      }
    },
    signIn() {
      this.$store.dispatch('signInBird', this.bird)
    },
    toggleSignOut() {
      if (this.bird.isSignedOut) {
        return this.signIn()
      }
      this.dialogVisible = true
      return
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
  min-width: 100px !important;
}
.bird-card {
  transition: all 0.5s;
  height: 300px !important;
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
  font-size: 14px;
  margin-bottom: 12px;
}
.signout-form {
  height: 100px !important;
}
</style>
