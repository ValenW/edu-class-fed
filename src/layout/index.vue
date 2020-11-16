<template>
  <el-container>
    <el-aside width="200px">
      <Aside />
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main> <router-view /> </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Aside from './components/aside.vue'

@Component({
  components: { Aside }
})
export default class index extends Vue {}
</script>

<style scoped></style>
