<template>
  <el-col align="middle" :xs="24" :sm="8" :md="8" :lg="8" :xl="8" :key="bird.name">
    <el-card :class="cardClass">
      <div class="block">
        <el-avatar fit="fill" :size="100" :src="bird.picture"></el-avatar>
      </div>
      <div style="padding-top: 20px;">
        <h3>{{ bird.name }}</h3>
        <div>
          <el-dialog
            :title="`Sign Out ${bird.name}`"
            :fullscreen="true"
            :visible.sync="dialogVisible">
            <span slot="footer" class="dialog-footer">
              <el-button @click="cancelSignOut">Cancel</el-button>
              <el-button type="primary" @click="signOut">Confirm</el-button>
            </span>
            <div>
              <el-radio v-model="signOutReason"
                border
                v-for="item in signOutOptions"
                :key="item.value"
                :label="item.label">
              </el-radio>
            </div>
            <el-input
              type="input"
              placeholder="Your name"
              style="margin-top: 30px;width:330px;"
              v-model="signOutUser">
            </el-input>
          </el-dialog>
          <el-dialog
            :title="`Log Activity for ${bird.name}`"
            :fullscreen="true"
            :visible.sync="logDialogVisible">
            <div v-for="item in logActivityOptions" :key="item.value" class="activity-button">
              <el-button round plain @click="doLogActivity(item.value)" type="primary">
                {{ item.label }}
              </el-button>
            </div>
            <el-input
              placeholder="Other reason"
              type="textarea"
              style="margin-top: 30px;"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model="otherNote">
            </el-input>
            <el-button round plain @click="doLogActivity()" type="primary" style="margin-top:20px;">
              Submit Other Reason
            </el-button>
          </el-dialog>
          <el-button slot="reference"
                     @click="toggleSignOut"
                     style="margin-top: 10px;"
                     type="primary">
            <div v-show="!bird.isSignedOut">Sign Out</div>
            <div v-show="bird.isSignedOut">Sign In</div>
          </el-button>
          <el-button slot="reference"
                     style="margin-top: 10px;"
                     @click="toggleLogActivity"
                     type="primary"
                     :disabled="bird.isSignedOut">
            Log Activity
          </el-button>
        </div>
      </div>
    </el-card>
  </el-col>
</template>

<script>
import { ACTIVITY_OPTIONS, SIGNOUT_OPTIONS } from '../constants'

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
  },
  data() {
    return {
      dialogVisible: false,
      logActivity: null,
      logDialogVisible: false,
      otherNote: '',
      signOutReason: null,
      signOutUser: '',
      logActivityOptions: Object.values(ACTIVITY_OPTIONS).map(x => ({ label: x, value: x })),
      signOutOptions: Object.values(SIGNOUT_OPTIONS).map(x => ({ label: x, value: x }))
    }
  },
  methods: {
    resetSignOutReason() {
      this.signOutReasons = []
      this.signOutUser = null
    },
    resetLogActivity() {
      this.otherNote = null
    },
    cancelSignOut() {
      this.resetSignOutReason()
      this.dialogVisible = false
    },
    doLogActivity(activity) {
      const note = this.otherNote && this.otherNote.trim()
      const event = activity || note

      if (event) {
        this.$store.dispatch('logBirdActivity', {
          bird: this.bird,
          event
        })
      }

      this.logDialogVisible = false
      this.resetLogActivity()
    },
    signOut() {
      if (this.requiresSignOutUser && this.signOutUser && !this.signOutUser.trim()) {
        return
      }

      if (this.signOutReason) {
        this.$store.dispatch('signOutBird', {
          bird: this.bird,
          reason: this.signOutReason,
          user: this.signOutUser
        })
      }

      this.dialogVisible = false
      this.resetSignOutReason()
    },
    requiresSignOutUser() {
      return this.signOutReasons.includes(SIGNOUT_OPTIONS.WALK)
          || this.signOutReasons.includes(SIGNOUT_OPTIONS.OUTREACH)
    },
    signIn() {
      this.$store.dispatch('signInBird', this.bird)
    },
    toggleLogActivity() {
      this.logDialogVisible = true
      return
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
.activity-button {
  display: inline-block !important;
  padding: 20px;
}
.bird-card {
  transition: all 0.5s;
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
