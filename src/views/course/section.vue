<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        课程名称
        <div class="operations"></div>
      </el-row>
    </div>
    列表
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class CourseSection extends Vue {
  @Prop({ type: String, required: true })
  private courseId!: string
}
</script>

<style scoped></style>
