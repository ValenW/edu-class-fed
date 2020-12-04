<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <span><a @click="$router.back()">&lt;</a>{{ courseName }}</span>
        <div class="operations">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
            @click="handleAddSection"
          >
            添加阶段
          </el-button>
        </div>
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
          <el-button @click.stop="handleEdit(data)">编辑</el-button>
          <el-button
            v-if="isLesson(data)"
            type="success"
            @click.stop="() => handleUploadVideo(data)"
          >
            上传视频
          </el-button>
          <el-button v-else type="primary" @click.stop="handleAddLesson(data)">
            添加课时
          </el-button>

          <el-select
            class="select-status"
            placeholder="请选择"
            v-model="data.status"
            @change="handleChangeStatus(data)"
          >
            <el-option label="已隐藏" :value="0" />
            <el-option label="待更新" :value="1" />
            <el-option label="已更新" :value="2" />
          </el-select>
        </span>
      </div>
    </el-tree>

    <update-dialog
      :visible.sync="dialogVisible"
      :createMode="createMode"
      :config="config"
      :init="init"
      :name="editingName"
      :updateMethod="updateMethod"
      @update="loadData()"
    />
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
import UpdateDialog from '@/component/Update/dialog.vue'
import { Tree } from 'element-ui'
import { TreeNode, TreeProps } from 'element-ui/types/tree'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FormConfig, Form as FormData } from '@/component/Update/index.vue'
import { Course, getById } from '@/services/course'

type Node = TreeNode<string, Section> & TreeNode<string, Lesson>
type TreeConfig<T> = {
  [key in keyof TreeProps]?:
    | keyof T
    | ((data: T, node: TreeNode<string, T>) => string)
} & { children?: keyof T }

@Component({
  components: { UpdateDialog }
})
export default class CourseSection extends Vue {
  @Prop({ type: String, required: true })
  private courseId!: string

  $refs!: {
    tree: Tree
  }

  private courseInfo: Course | any = {}
  private content: Section[] | null = null
  private displayConfig: TreeConfig<Section> | TreeConfig<Lesson> = {
    children: 'lessonDTOS',
    label: (d: Section | Lesson) => (this.isLesson(d) ? d.theme : d.sectionName)
  }

  private dialogVisible: boolean = false
  private createMode: boolean = false
  private config: FormConfig[] = []
  private sectionConfig: FormConfig[] = [
    {
      prop: 'courseName',
      label: '课程名称',
      type: 'text',
      required: true,
      disabled: true
    },
    { prop: 'sectionName', label: '章节名称', type: 'text', required: true },
    { prop: 'description', label: '章节描述', type: 'textarea' },
    {
      prop: 'orderNum',
      label: '章节排序',
      type: 'text',
      config: { type: 'number', append: '数字控制排序，数字越大越靠后' }
    }
  ]
  private lessonConfig: FormConfig[] = [
    {
      prop: 'courseName',
      label: '课程名称',
      type: 'text',
      required: true,
      disabled: true
    },
    {
      prop: 'sectionName',
      label: '章节名称',
      type: 'text',
      required: true,
      disabled: true
    },
    { prop: 'theme', label: '课时名称', type: 'text', required: true },
    {
      prop: 'duration',
      label: '时长',
      type: 'text',
      config: { type: 'number', append: '分钟' }
    },
    {
      prop: 'isFree',
      label: '开放试听',
      type: 'boolean',
      required: true
    },
    {
      prop: 'orderNum',
      label: '课时排序',
      type: 'text',
      config: { type: 'number', append: '数字控制排序，数字越大越靠后' }
    }
  ]
  private init: FormData & any = {}
  private updateMethod = updateSection
  private editingName: string = ''

  private async created() {
    this.loadData()
  }

  private async loadData() {
    const {
      data: { data }
    } = await getById(this.courseId)
    this.courseInfo = data
    const {
      data: { data: content }
    } = await getSectionAndLesson(this.courseId)

    console.log(content)

    this.content = content
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
    const updateMethod = this.getUpdateMethod(dragNode.data)

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

  private handleAddSection() {
    this.handleEdit(
      {
        courseId: this.courseId,
        courseName: this.courseName
      },
      true
    )
  }

  private handleAddLesson(item: Section) {
    this.handleEdit(
      {
        courseId: this.courseId,
        courseName: this.courseName,
        sectionId: item.id,
        sectionName: item.sectionName
      },
      true
    )
  }

  private async handleEdit(item: any, createMode: boolean = false) {
    const section = this.sections.find(s => s.id === item.sectionId)
    const sectionName = (section && section.sectionName) || item.sectionName
    this.createMode = createMode
    this.config = this.isLesson(item) ? this.lessonConfig : this.sectionConfig
    this.editingName = this.isLesson(item) ? '课时' : '章节'
    this.updateMethod = this.getUpdateMethod(item)
    this.dialogVisible = true
    this.init = { ...item, sectionName, courseName: this.courseName }
  }

  private async handleChangeStatus(item: Lesson | Section) {
    const updateMethod = this.getUpdateMethod(item)
    try {
      const {
        data: { code, mesg }
      } = await updateMethod({
        id: item.id,
        status: item.status
      })
      if (Number(code)) {
        throw new Error(mesg)
      }
      this.$message.success('更新状态成功')
    } catch (error) {
      this.$message.error(`更新状态失败: ${error}`)
    }
  }

  private isLesson(data: any): data is Lesson {
    return typeof data.sectionId === 'number'
  }

  private isSection(data: any): data is Section {
    return typeof data.sectionName === 'string' && !this.isLesson(data)
  }

  private getUpdateMethod(data: Lesson | Section) {
    return this.isLesson(data) ? updateLesson : updateSection
  }

  private get courseName(): string {
    return (this.courseInfo && this.courseInfo.courseName) || '课程管理'
  }

  private get sections(): Section[] {
    return this.content || []
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
