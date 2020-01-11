<template>
  <el-form ref="form" :model="form" label-width="auto">
    <el-form-item label="Name" label-position="left">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="Picture">
      <el-upload
        action=""
        accept="image/*"
        list-type="picture"
        ref="upload"
        :auto-upload="false"
        :limit="limit"
        :on-change="handleChange"
        :on-remove="handleRemove">
        <el-button slot="trigger" size="small" type="primary">select image</el-button>
      </el-upload>
    </el-form-item>
    <el-form-item>
       <transition name="el-fade-in">
        <el-button v-if="canSubmit" type="success" @click="onSubmit">Submit</el-button>
      </transition>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BirdCreate',
  data() {
    return {
      limit: 1,
      form: {
        name: null,
        picture: null
      }
    }
  },
  computed: {
    canSubmit() {
      return this.form.name && this.form.picture
    },
    birds() {
      return this.$store.state.birds
    }
  },
  methods: {
    handleChange(file) {
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.form.picture = reader.result
      }
      reader.onerror = error => {
        window.console.log(error)
        return
      }
    },
    handleRemove() {
      this.form.picture = null
    },
    onSubmit() {
      const bird = {
        name: this.form.name,
        picture: this.form.picture,
      };
      if (bird.name && bird.picture) {
        this.$store.commit('addBird', bird)
        this.$refs.form.resetFields()
        this.$refs.upload.clearFiles()
        this.form.name = null
        this.form.picture = null
      }
      return
    }
  }
}
</script>
