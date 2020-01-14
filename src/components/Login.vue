<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="auto">
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
          firebase.auth().signInWithEmailAndPassword(email, pass)
        }
      })
    }
  }
}
</script>

<style scoped>
.login-button {
  text-align: center;
}
</style>
