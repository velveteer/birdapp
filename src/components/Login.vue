<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto" v-loading.fullscreen.lock="loading">
      <el-form-item label="Email" prop="user">
        <el-input v-model="form.user"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="pass">
        <el-input v-model="form.pass" type="password"></el-input>
      </el-form-item>
    </el-form>
    <div class="login-button">
      <el-button type="primary" @click="onSubmit">Login</el-button>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        user: null,
        pass: null
      },
      loading: false,
      rules: {
        user: [
          { required: true, message: 'Please input email', trigger: 'blur' },
        ],
        pass: [
          { required: true, message: 'Please input password', trigger: 'change' }
        ],
      },
    }
  },
  computed: {
    canSubmit() {
      return this.form.user && this.form.pass
    },
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const email = this.form.user
          const pass  = this.form.pass
          this.loading = true
          firebase.auth().signInWithEmailAndPassword(email, pass)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.login {
  margin: 100px auto;
  width: 50%;
}
.login-button {
  text-align: right;
}
</style>
