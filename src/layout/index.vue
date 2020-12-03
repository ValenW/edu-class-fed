<template>
  <el-container class="container">
    <div class="aside">
      <Aside />
    </div>
    <el-container>
      <el-header class="header" height="50px">
        <Header />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Aside from './components/aside.vue'
import Header from './components/header.vue'

@Component({
  components: { Aside, Header }
})
export default class index extends Vue {}
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  .aside {
    height: 100%;
  }
  .header {
    background: white;
    height: 50px;
    padding: 0;
  }
}
</style>
