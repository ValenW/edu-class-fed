<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        资源分类
        <div class="operations">
          <el-button size="mini" @click="handleAdd">
            添加类别
          </el-button>
        </div>
      </el-row>
    </div>

    <el-table
      :data="data"
      style="width: 100%; margin-bottom: 20px"
      v-loading="loading"
    >
      <el-table-column type="index" label="编号" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="createdTime" label="创建时间" />
      <el-table-column prop="sort" label="排序" />
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
  </el-card>
</template>

<script lang="ts">
import { ResourceCategory } from '@/services/resource'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class category extends Vue {
  private data: ResourceCategory[] = []
  private loading: boolean = false

  created() {
    this.loadData()
  }

  loadData() {}

  private handleAdd() {
    // TODO
  }

  private handleEdit(item: ResourceCategory) {
    // TODO
  }

  private handleDelete(item: ResourceCategory) {
    // TODO
  }
}
</script>

<style scoped></style>
