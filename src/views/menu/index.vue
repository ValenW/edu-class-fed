<template>
  <el-card class="menu">
    <div slot="header" class="clearfix">
      <el-button @click="() => $router.push({ name: 'menu-create' })">
        新建菜单
      </el-button>
    </div>

    <el-table :data="menus" style="width: 100%">
      <el-table-column label="编号" min-width="150" type="index">
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" min-width="150">
      </el-table-column>
      <el-table-column prop="level" label="菜单级数" min-width="150">
      </el-table-column>
      <el-table-column prop="icon" label="前端图标" min-width="150">
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" min-width="150">
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { deleteMenu, getAllMenuInfo, Menu } from '@/services/menu'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MenuIndex extends Vue {
  private menus: Menu[] = []

  private created() {
    this.fetchMenus()
  }

  private async fetchMenus() {
    const {
      data: { code, mesg, data }
    } = await getAllMenuInfo()
    if (Number.parseInt(code)) {
      this.$message.error('获取菜单失败, 请联系管理员')
    }

    this.menus = data
  }

  private handleEdit(menu: Menu) {
    this.$router.push({
      name: 'menu-edit',
      params: { id: `${menu.id}` }
    })
    console.log('handleEdit', menu)
  }

  private handleDelete(menu: Menu) {
    console.log('handleDelete', menu)
    this.$confirm('确认删除?', '删除菜单', {})
      .then(async () => {
        const {
          data: { code, mesg }
        } = await deleteMenu(menu.id)
        if (Number.parseInt(code)) {
          throw new Error(mesg)
        }
        this.$message.success('删除成功')
        this.fetchMenus()
      })
      .catch(() => this.$message.info('取消删除'))
  }
}
</script>

<style lang="scss" scoped></style>
