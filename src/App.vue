<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu
          :router="true"
          :default-active="$route.path"
          mode="horizontal">
          <el-menu-item index="/">View Birds</el-menu-item>
          <el-menu-item index="/add">Add Bird</el-menu-item>
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
}
</script>

<style>
</style>
