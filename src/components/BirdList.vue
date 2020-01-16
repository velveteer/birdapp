<template>
  <div>
    <el-row :gutter="20">
      <BirdCard v-for="bird in birds" :bird="bird" :key="bird.id"></BirdCard>
    </el-row>
  </div>
</template>

<script>
import BirdCard from './BirdCard.vue'

export default {
  name: 'BirdList',
  components: {
    BirdCard
  },
  computed: {
    birds() {
      return this.$store.state.birds
    },
  }
}
</script>
