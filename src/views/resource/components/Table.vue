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
import { deleteResource, Resource } from '@/services/resource'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Table extends Vue {
  @Prop({ type: Array, default: [] })
  private resources!: Resource[]

  @Prop({ type: Boolean, default: false })
  private loading!: boolean

  private handleEdit(item: Resource) {
    this.$emit('edit', item)
  }

  private async handleDelete(item: Resource) {
    try {
      const {
        data: { code, mesg, data }
      } = await deleteResource(item.id)
      if (Number(code)) {
        throw new Error('mesg')
      }
      this.$message.success('删除成功')
      this.$emit('update')
    } catch (err) {
      this.$message.error(`删除失败: ${err}`)
    }
  }
}
</script>

<style scoped></style>
