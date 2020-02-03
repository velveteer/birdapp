<template>
  <div>
    <div class="bird-row">
        <div style="text-align:right;">
        <router-link to="/add">
          <el-button plain type="success" icon="el-icon-plus">
            Add Bird
          </el-button>
        </router-link>
        </div>
    </div>
    <div v-for="bird in birds" :key="bird.id">
        <div class="bird-row">
          <el-card style="width:100%;">
            <div class="bird-row__avatar">
              <el-avatar :src="bird.picture" fit="fill"></el-avatar>
              <div class="bird-row__name">{{ bird.name }}</div>
            </div>
            <div class="bird-row__controls">
              <router-link :to="{ path: '/edit', query: { birdId: bird.id }}" style="margin-right:12px;">
                <el-button class="button"
                           icon="el-icon-edit"
                           plain>
                </el-button>
              </router-link>
              <el-button :type="getDeleteButtonType(bird)"
                         class="button"
                         plain
                         icon="el-icon-delete"
                         @click="deleteBird(bird)">
              </el-button>
            </div>
          </el-card>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BirdManage',
  data() {
    return {
      deleteVisible: false,
      selectedBird: {},
      primed: {},
      timeouts: {},
    }
  },
  computed: {
    birds() {
      return this.$store.state.birds
    }
  },
  methods: {
    deleteBird(bird) {
      if (this.primed[bird.id] === 2) {
        this.$store.dispatch('deleteBird', bird)
        this.$delete(this.primed, bird.id)
      } else {
        this.$set(this.primed, bird.id, (this.primed[bird.id] || 0) + 1)
        clearTimeout(this.timeouts[bird.id])
        this.timeouts[bird.id] = setTimeout(() => {
          this.$delete(this.primed, bird.id)
          this.$delete(this.timeouts, bird.id)
        }, 4000)
      }
    },
    getDeleteButtonType(bird) {
      if (this.primed[bird.id] === 2) {
        return 'danger'
      }
      if (this.primed[bird.id] === 1) {
        return 'warning'
      }
      return
    },
  }
}
</script>

<style scoped>
.bird-row {
  width: 100%;
  margin-bottom: 20px;
}
.bird-row__avatar {
  float: left;
}
.bird-row__name {
  float: right;
  font-size: 18px;
  margin-top: 10px;
  margin-left: 14px;
}
.bird-row__controls {
  text-align: right;
  width: 100%;
}
</style>
