<template>
  <el-table :data="roles" v-loading="loading">
    <el-table-column prop="id" label="编号" />
    <el-table-column prop="name" label="角色名称" />
    <el-table-column prop="description" label="描述" />
    <el-table-column prop="createdTime" label="添加时间" />
    <el-table-column label="操作" align="center">
      <template slot-scope="{ row }">
        <div>
          <el-button type="text" @click="handleMenu(row)">
            分配菜单
          </el-button>
          <el-button type="text" @click="handleResource(row)">
            分配资源
          </el-button>
        </div>
        <div>
          <el-button type="text" @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button size="mini" type="text" @click="handleDelete(row)">
            删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Role } from '@/services/role'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Table extends Vue {
  @Prop({ type: Array, default: [] })
  private roles!: Role[]

  @Prop({ type: Boolean, default: false })
  private loading!: boolean

  private handleMenu(item: Role) {
    console.log('handleMenu', item)
  }

  private handleResource(item: Role) {
    console.log('handleResource', item)
  }

  private handleEdit(item: Role) {
    console.log('handleEdit', item)
  }

  private handleDelete(item: Role) {
    console.log('handleDelete', item)
  }
}
</script>

<style scoped></style>
