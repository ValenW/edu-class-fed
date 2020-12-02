<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        {{ courseName }}
        <div class="operations"></div>
      </el-row>
    </div>

    <el-tree :data="sections" :props="displayConfig" node-key="id" draggable>
      <div class="node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>

        <span class="actions">
          <template v-if="isLesson(data)">
            <el-button>编辑</el-button>
            <el-button type="success">上传视频</el-button>
          </template>
          <template v-else>
            <el-button>编辑</el-button>
            <el-button type="primary">添加课时</el-button>
          </template>

          <el-select class="select-status" placeholder="请选择">
            <el-option label="已隐藏" :value="0" />
            <el-option label="待更新" :value="1" />
            <el-option label="已更新" :value="2" />
          </el-select>
        </span>
      </div>
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
  private displayConfig: TreeConfig<Section> | TreeConfig<Lesson> = {
    children: 'courseLessons',
    label: (d: Section | Lesson) => (this.isLesson(d) ? d.theme : d.sectionName)
  }

  private async created() {
    const {
      data: { content }
    } = await getSectionAndLesson(this.courseId)

    this.content = content
    console.log(this.content)
  }

  private isLesson(data: any): data is Lesson {
    return typeof data.sectionId === 'number'
  }

  private get courseName(): string {
    return (this.content && this.content.courseName) || '课程管理'
  }

  private get sections(): Section[] {
    return (this.content && this.content.courseSectionList) || []
  }
}
</script>

<style lang="scss" scoped>
.node {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .select-status {
    max-width: 100px;
    margin-left: 8px;
  }
}

::v-deep .el-tree-node__content {
  height: auto;
}
</style>
