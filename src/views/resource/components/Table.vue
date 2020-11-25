<template>
  <el-table
    :data="resources"
    style="width: 100%; margin-bottom: 20px"
    v-loading="loading"
  >
    <el-table-column type="index" label="编号"> </el-table-column>
    <el-table-column prop="name" label="资源名称"> </el-table-column>
    <el-table-column prop="url" label="资源路径"> </el-table-column>
    <el-table-column prop="description" label="描述"> </el-table-column>
    <el-table-column prop="createdTime" label="添加时间"> </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="{ row }">
        <el-button size="mini" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button size="mini" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Resource } from '@/services/resource'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Table extends Vue {
  @Prop({ type: Array, default: [] })
  private resources!: Resource[]

  @Prop({ type: Boolean, default: false })
  private loading!: boolean

  private handleEdit(item: any) {
    console.log('handleEdit', item)
  }

  private handleDelete(item: any) {
    console.log('handleDelete', item)
  }
}
</script>

<style scoped></style>
