<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        {{ courseName }}
        <div class="operations"></div>
      </el-row>
    </div>

    <el-tree
      :data="sections"
      :props="displayConfig"
      node-key="id"
      draggable
      :allow-drop="allowDrop"
      @node-drop="reorder"
    >
      <div class="node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>

        <span class="actions">
          <template v-if="isLesson(data)">
            <el-button>编辑</el-button>
            <el-button type="success" @click="() => handleUploadVideo(data)">
              上传视频
            </el-button>
          </template>
          <template v-else>
            <el-button>编辑</el-button>
            <el-button type="primary">添加课时</el-button>
          </template>

          <el-select
            class="select-status"
            placeholder="请选择"
            v-model="data.status"
          >
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
  Section,
  updateLesson,
  updateSection
} from '@/services/section'
import { Tree } from 'element-ui'
import { TreeNode, TreeProps } from 'element-ui/types/tree'
import { Vue, Component, Prop } from 'vue-property-decorator'

type Node = TreeNode<string, Section> & TreeNode<string, Lesson>
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

  private allowDrop(
    draggingNode: Node,
    dropNode: Node,
    type: 'prev' | 'inner' | 'next'
  ): boolean {
    const draggingData = draggingNode.data
    const dropData = dropNode.data
    if (this.isLesson(draggingData) && this.isLesson(dropData)) {
      return draggingData.sectionId === dropData.sectionId && type !== 'inner'
    } else if (this.isSection(draggingData) && this.isSection(dropData)) {
      return type !== 'inner'
    } else if (this.isLesson(draggingData) && this.isSection(dropData)) {
      return draggingData.sectionId === dropData.id && type === 'inner'
    }
    return false
  }

  private async reorder(
    dragNode: Node,
    dropNode: Node,
    type: 'prev' | 'inner' | 'next'
  ) {
    if (!dropNode.parent) {
      console.log(dragNode)

      return
    }
    const updateMethod = this.isLesson(dragNode.data)
      ? updateLesson
      : updateSection

    try {
      await Promise.all(
        dropNode.parent.childNodes.map(({ data }, index) =>
          updateMethod({ id: data.id, orderNum: index })
        )
      )
      this.$message.success('排序成功')
    } catch (error) {
      this.$message.error(`排序失败: ${error}`)
    }
  }

  private handleUploadVideo(lesson: Lesson): void {
    this.$router.push({
      name: 'course-video',
      params: { courseId: `${lesson.courseId}`, lessonId: `${lesson.id}` }
    })
  }

  private isLesson(data: any): data is Lesson {
    return typeof data.sectionId === 'number'
  }

  private isSection(data: any): data is Section {
    return typeof data.sectionName === 'string' && !this.isLesson(data)
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
