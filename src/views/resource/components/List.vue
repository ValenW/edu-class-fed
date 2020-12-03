<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          资源管理
          <div class="operations">
            <el-button size="mini" @click="() => handleEdit()">
              添加资源
            </el-button>
            <el-button size="mini" @click="handleCategory">
              资源分类
            </el-button>
          </div>
        </el-row>
      </div>

      <el-form inline ref="form" :model="form">
        <el-form-item prop="name" label="资源名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="资源路径">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item prop="categoryId" label="资源分类">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择资源分类"
            clearable
          >
            <el-option
              v-for="{ label, value } in categorySelects"
              :label="label"
              :value="value"
              :key="value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="() => reloadResource()"
            :disabled="loading"
          >
            查询搜索
          </el-button>
          <el-button @click="onReset" :disabled="loading">重置</el-button>
        </el-form-item>
      </el-form>

      <Table
        :loading="loading"
        :resources="resources"
        @edit="handleEdit"
        @update="reloadResource()"
      />

      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :disabled="loading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <update-dialog
      :visible.sync="dialogVisible"
      :createMode="createMode"
      :config="config"
      :init="init"
      :name="'资源'"
      :updateMethod="updateMethod"
      @update="reloadResource()"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import Table from './Table.vue'
import {
  getAllCategory,
  getByPage,
  Resource,
  ResourceCategory,
  ResourceQueryParam,
  updateResource
} from '@/services/resource'
import UpdateDialog from '@/component/Update/dialog.vue'
import { FormConfig, Form as FormData } from '@/component/Update/index.vue'

@Component({
  components: { Table, UpdateDialog }
})
export default class ResourceList extends Vue {
  $refs!: {
    form: Form
  }

  private resources: Resource[] = []
  private resourceCategories: ResourceCategory[] = []
  private form: ResourceQueryParam = {}
  private total: number = 0
  private loading: boolean = true

  private dialogVisible: boolean = false
  private createMode: boolean = false
  private config: FormConfig[] = [
    { prop: 'name', label: '资源名称', type: 'text' },
    {
      prop: 'categoryId',
      label: '资源分类',
      type: 'select',
      selects: this.categorySelects
    },
    { prop: 'url', label: '资源路径', type: 'text' },
    { prop: 'description', label: '描述', type: 'textarea' }
  ]
  private init: FormData = {}
  private updateMethod = updateResource

  private created() {
    this.reloadResource()
    this.loadResourceCategories()
  }

  private async reloadResource(current: number = 1) {
    this.form.current = current
    return this.loadResources()
  }

  private async loadResources() {
    this.loading = true

    const {
      data: {
        data: { records, total }
      }
    } = await getByPage(this.form)

    this.resources = records
    this.total = total

    this.loading = false
  }

  private async loadResourceCategories() {
    const {
      data: { data }
    } = await getAllCategory()
    this.resourceCategories = data
  }

  private async handleEdit(item?: Resource) {
    this.createMode = !item
    this.dialogVisible = true
    this.init = item || {}
  }

  private handleCategory() {
    this.$router.push({ name: 'category' })
  }

  private onReset() {
    this.$refs.form.resetFields()
    this.reloadResource()
  }

  private onSizeChange(val: number) {
    this.form.size = val
    this.reloadResource()
  }

  private onCurrentChange(val: number) {
    this.reloadResource(val)
  }

  private get categorySelects(): { value: string | number; label: string }[] {
    const result = this.resourceCategories.map(r => ({
      value: r.id,
      label: r.name
    }))
    if (this.config) {
      const categoryIdConfig = this.config.find(c => c.prop === 'categoryId')
      if (categoryIdConfig) {
        categoryIdConfig.selects = result
      }
    }
    return result
  }
}
</script>

<style lang="scss" scoped></style>
