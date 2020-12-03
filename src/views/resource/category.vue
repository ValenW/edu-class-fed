<template>
  <div class="category-list">
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

    <update-dialog
      :visible.sync="dialogVisible"
      :createMode="createMode"
      :config="config"
      :init="init"
      :name="'资源'"
      :updateMethod="updateMethod"
      @update="loadData()"
    />
  </div>
</template>

<script lang="ts">
import UpdateDialog from '@/component/Update/dialog.vue'
import { FormConfig, Form as FormData } from '@/component/Update/index.vue'
import {
  ResourceCategory,
  updateCategory,
  deleteCategory,
  getAllCategory
} from '@/services/resource'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { UpdateDialog }
})
export default class category extends Vue {
  private data: ResourceCategory[] = []
  private loading: boolean = false
  private dialogVisible: boolean = false
  private createMode: boolean = false
  private config: FormConfig[] = [
    { prop: 'name', label: '分类名称', type: 'text' },
    { prop: 'sort', label: '分类排序', type: 'number', config: { min: 0 } }
  ]
  private init: FormData & any = {}
  private updateMethod = updateCategory

  private created() {
    this.loadData()
  }

  private async loadData() {
    this.loading = true
    const {
      data: { data }
    } = await getAllCategory()
    this.data = data
    this.loading = false
  }

  private handleAdd() {
    this.handleEdit()
  }

  private async handleEdit(item?: ResourceCategory) {
    this.createMode = !item
    this.dialogVisible = true
    this.init = item || {}
  }

  private async handleDelete(item: ResourceCategory) {
    try {
      const {
        data: { code, mesg, data }
      } = await deleteCategory(item.id)
      if (Number(code)) {
        throw new Error('mesg')
      }
      this.$message.success('删除成功')
      this.loadData()
    } catch (err) {
      this.$message.error(`删除失败: ${err}`)
    }
  }
}
</script>

<style scoped></style>
