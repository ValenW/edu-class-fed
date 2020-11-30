<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        编辑课程
        <div class="operations"></div>
      </el-row>
    </div>
    <Update :create-mode="false" :course-id="courseId" />
  </el-card>
</template>

<script lang="ts">
import Update from './component/Update.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { Update }
})
export default class EditCourse extends Vue {
  @Prop({ required: true })
  private courseId!: number
}
</script>

<style scoped></style>
