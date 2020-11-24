<template>
  <div :class="`menu-${createMode ? 'create' : 'edit'}`">
    <el-card class="menu">
      <div slot="header" class="clearfix">
        <span>{{ createMode ? '添加菜单' : '更新菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option :value="-1" label="无上级菜单"></el-option>
            <el-option
              v-for="item in parentOptionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.orderNum"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="createMode">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
  createOrUpdateMenu,
  getEditMenuInfo,
  MenuForm,
  Menu
} from '@/services/menu'

type ParentOptionItem = Pick<Menu, 'id' | 'name'>

@Component
export default class MenuCreate extends Vue {
  @Prop(Boolean)
  createMode: boolean = false

  private form: MenuForm = {
    parentId: -1,
    name: '',
    href: '',
    icon: '',
    orderNum: 0,
    description: '',
    shown: false
  }
  private parentMenuList: Menu[] = []

  private get parentOptionList(): ParentOptionItem[] {
    return this.parentMenuList.map(parent => ({
      name: parent.name,
      id: parent.id
    }))
  }

  private created() {
    this.loadMenuInfo()
  }

  private async loadMenuInfo() {
    const {
      data: {
        code,
        data: { menuInfo, parentMenuList }
      }
    } = await getEditMenuInfo()
    if (Number.parseInt(code)) {
      this.$message.error('获取上级菜单失败, 请联系管理员')
      return
    }

    this.parentMenuList = parentMenuList || []
  }

  private async onSubmit() {
    const {
      data: { code, mesg }
    } = await createOrUpdateMenu(this.form)

    const actionName = this.createMode ? '创建' : '更新'
    if (Number(code)) {
      this.$message.error(`${actionName}菜单失败: ${mesg} 请联系管理员`)
    } else {
      this.$message.success(`${actionName}菜单成功`)
      this.$router.back()
    }
  }
}
</script>

<style scoped></style>
