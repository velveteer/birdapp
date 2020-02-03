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
    <el-dialog
      :title="`Delete ${selectedBird.name}?`"
      :visible.sync="deleteVisible">
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelete">Cancel</el-button>
        <el-button type="primary" @click="deleteSelectedBird">Confirm</el-button>
      </span>
    </el-dialog>
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
              <el-button type="danger"
                         class="button"
                         plain
                           icon="el-icon-delete"
                         @click="toggleDelete(bird)">
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
    }
  },
  computed: {
    birds() {
      return this.$store.state.birds
    }
  },
  methods: {
    cancelDelete() {
      this.deleteVisible = false
    },
    deleteSelectedBird() {
      this.$store.dispatch('deleteBird', this.selectedBird)
      this.deleteVisible = false
    },
    toggleDelete(bird) {
      this.selectedBird = bird
      this.deleteVisible = true
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
