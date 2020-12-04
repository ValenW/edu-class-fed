<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <span>
          <el-button
            icon="el-icon-arrow-left"
            size="mini"
            @click="$router.back()"
            type="text"
          >
            返回
          </el-button>
          <el-divider direction="vertical"></el-divider>
          新建课程
        </span>
        <div class="operations"></div>
      </el-row>
    </div>
    <Update :create-mode="true" />
  </el-card>
</template>

<script lang="ts">
import Update from './component/Update.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { Update }
})
export default class CreateCourse extends Vue {}
</script>

<style scoped></style>
