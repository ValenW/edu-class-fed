<template>
  <el-card>
    <div slot="header">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          新建课程
          <div class="operations"></div>
        </el-row>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class create extends Vue {}
</script>

<style scoped></style>
