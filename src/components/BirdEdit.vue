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
        <el-button v-if="canSubmit" type="success" @click="onSubmit">Update</el-button>
      </transition>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BirdEdit',
  created() {
    if (this.bird) this.form.name = this.bird.name
  },
  data() {
    return {
      limit: 1,
      loadingImage: false,
      form: {
        name: null,
        picture: null
      }
    }
  },
  computed: {
    canSubmit() {
      return this.form.name
    },
    birdId() {
      return this.$route.query.birdId
    },
    bird() {
      return this.$store.state.birds.filter(b => b.id === this.birdId).pop()
    }
  },
  methods: {
    handleChange(file) {
      const reader = new FileReader()
      this.loadingImage = true
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.form.picture = reader.result
        this.loadingImage = false
      }
      reader.onerror = error => {
        window.console.log(error)
        this.loadingImage = false
        return
      }
    },
    handleRemove() {
      this.form.picture = null
    },
    onSubmit() {
      if (this.form.name && !this.loadingImage) {
        const bird = {
          id: this.birdId,
          name: this.form.name,
          picture: this.form.picture,
        }
        this.$store.dispatch('updateBird', bird)
        this.$router.push('/manage')
      }
      return
    }
  },
}
</script>
