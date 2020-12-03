<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        分配资源
      </el-row>
    </div>

    <el-tree
      ref="tree"
      node-key="id"
      :data="structureResources"
      :default-checked-keys="selectedKeys"
      default-expand-all
      show-checkbox
    >
    </el-tree>

    <el-divider />
    <el-button type="primary" @click="onSave">保存</el-button>
    <el-button @click="onReset">清空</el-button>
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Tree } from 'element-ui'
import { TreeData } from 'element-ui/types/tree'
import {
  assignResourceToRole,
  getAllCategory,
  getAllResource,
  getByRole,
  Resource,
  ResourceCategory
} from '@/services/resource'

@Component({
  components: {}
})
export default class AssignResource extends Vue {
  @Prop({ type: String, required: true })
  private roleId!: string

  $refs!: {
    tree: Tree
  }
  private categories: ResourceCategory[] = []
  private resources: Resource[] = []
  private resourcesByRole: ResourceCategory[] = []

  created() {
    this.loadCategory()
    this.loadResources()
    this.loadResourceByRole()
  }

  private async loadResources() {
    const {
      data: { data: resources }
    } = await getAllResource()
    this.resources = resources
  }

  private async loadCategory() {
    const {
      data: { data: categories }
    } = await getAllCategory()
    this.categories = categories
  }

  private async loadResourceByRole() {
    const {
      data: { data: resourcesByRole }
    } = await getByRole(this.roleId)
    this.resourcesByRole = resourcesByRole
  }

  private async onSave() {
    const keys = this.$refs.tree.getCheckedNodes().reduce((acc, cur) => {
      if (!cur.children) {
        acc.push(cur.id)
      }
      return acc
    }, [] as number[])
    const {
      data: { code, mesg }
    } = await assignResourceToRole(keys, this.roleId)
    if (Number.parseInt(code)) {
      this.$message.error(`更新资源失败, 请联系管理员. 错误信息: ${mesg}`)
    }
    this.$message.success('更新成功')
    this.$router.back()
  }

  private onReset() {
    this.$refs.tree.setCheckedKeys([])
  }

  private get structureResources(): TreeData[] {
    return this.categories.map(c => ({
      id: `c-${c.id}`,
      label: c.name,
      children: this.resources
        .filter(r => r.categoryId === c.id)
        .map(r => ({
          id: r.id,
          label: r.name
        }))
    }))
  }

  private get selectedKeys(): number[] {
    return this.getSelectedKeys(this.resourcesByRole)
  }

  private getSelectedKeys(
    resources: { id: number; selected: boolean; resourceList?: Resource[] }[]
  ): number[] {
    return resources.reduce((acc, cur) => {
      if (cur.resourceList) {
        acc.push(...this.getSelectedKeys(cur.resourceList))
      } else if (cur.selected) {
        acc.push(cur.id)
      }
      return acc
    }, [] as number[])
  }
}
</script>

<style scoped></style>
