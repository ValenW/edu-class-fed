<template>
  <el-card class="menu">
    <div slot="header" class="clearfix">
      <el-button @click="() => $router.push({ name: 'menu-create' })">
        新建菜单
      </el-button>
    </div>
    <div v-for="o in 4" :key="o" class="text item">
      {{ '列表内容 ' + o }}
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MenuIndex extends Vue {}
</script>

<style lang="scss" scoped></style>
