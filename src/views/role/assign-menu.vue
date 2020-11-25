<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        分配菜单
      </el-row>
    </div>

    <el-tree
      :props="menuProps"
      :data="menus"
      node-key="id"
      default-expand-all
      :default-checked-keys="selectedKeys"
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
import { getByRole, getWithStructure, Menu } from '@/services/menu'

@Component({
  components: {}
})
export default class AssignMenu extends Vue {
  @Prop({ type: String, required: true })
  private roleId!: string

  private menus: Menu[] = []
  private menusByRole: Menu[] = []
  private menuProps: { [key in keyof TreeData]: keyof Menu } = {
    label: 'name',
    children: 'subMenuList'
  }

  created() {
    this.loadMenus()
  }

  private async loadMenus() {
    const [
      {
        data: { data: menus }
      },
      {
        data: { data: menusByRole }
      }
    ] = await Promise.all([getWithStructure(), getByRole(this.roleId)])
    this.menus = menus
    this.menusByRole = menusByRole
  }

  private onSave() {
    console.log('onSave')
  }

  private onReset() {
    console.log('onReset')
  }

  private get selectedKeys(): number[] {
    return this.getSelectedKeys(this.menusByRole)
  }

  private getSelectedKeys(menus: Menu[]): number[] {
    return menus.reduce((acc, cur) => {
      if (cur.selected) {
        acc.push(cur.id)
      }
      if (cur.subMenuList) {
        acc.push(...this.getSelectedKeys(cur.subMenuList))
      }
      return acc
    }, [] as number[])
  }
}
</script>

<style scoped></style>