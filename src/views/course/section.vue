<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        {{ courseName }}
        <div class="operations"></div>
      </el-row>
    </div>

    <el-tree :data="sections" :props="displayConfig" node-key="id" draggable>
    </el-tree>
  </el-card>
</template>

<script lang="ts">
import {
  CourseContent,
  getSectionAndLesson,
  Lesson,
  Section
} from '@/services/course-section'
import { Tree } from 'element-ui'
import { TreeNode, TreeProps } from 'element-ui/types/tree'
import { Vue, Component, Prop } from 'vue-property-decorator'

type TreeConfig<T> = {
  [key in keyof TreeProps]?:
    | keyof T
    | ((data: T, node: TreeNode<string, T>) => string)
} & { children?: keyof T }

@Component({
  components: {}
})
export default class CourseSection extends Vue {
  @Prop({ type: String, required: true })
  private courseId!: string

  $refs!: {
    tree: Tree
  }

  private content: CourseContent | null = null
  private displayConfig: TreeConfig<Section & Lesson> = {
    children: 'courseLessons',
    label: d => (typeof d.sectionId === 'number' ? d.theme : d.sectionName)
  }

  private async created() {
    const {
      data: { content }
    } = await getSectionAndLesson(this.courseId)

    this.content = content
    console.log(this.content)
  }

  private get courseName(): string {
    return (this.content && this.content.courseName) || '课程管理'
  }

  private get sections(): Section[] {
    return (this.content && this.content.courseSectionList) || []
  }
}
</script>

<style scoped></style>
