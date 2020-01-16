<template>
  <div id="app" v-if="loaded">
    <el-container>
      <el-header>
        <el-menu
          v-show="user"
          :router="true"
          :default-active="$route.path"
          mode="horizontal">
          <el-menu-item index="/">Sign In/Out</el-menu-item>
          <el-menu-item index="/manage">Manage Birds</el-menu-item>
          <el-menu-item index="/log">Activity Log</el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    loaded() {
      return this.$store.state.loaded
    },
    user() {
      return this.$store.state.user
    }
  },
}
</script>

<style>
</style>
