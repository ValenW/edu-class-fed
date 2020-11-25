<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          资源管理
          <div class="operations">
            <el-button size="mini">
              添加资源
            </el-button>
            <el-button size="mini">
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
              :label="item.name"
              :value="item.id"
              v-for="item in resourceCategories"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="() => reloadResource()"
            :disabled="isLoading"
          >
            查询搜索
          </el-button>
          <el-button @click="onReset" :disabled="isLoading">重置</el-button>
        </el-form-item>
      </el-form>

      <Table :isLoading="isLoading" :resources="resources" />

      <el-pagination
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
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
  ResourceQueryParam
} from '@/services/resource'

@Component({
  components: { Table }
})
export default class ResourceList extends Vue {
  $refs!: {
    form: Form
  }

  private resources: Resource[] = []
  private resourceCategories: ResourceCategory[] = []
  private form: ResourceQueryParam = {}
  private totalCount: number = 0
  private isLoading: boolean = true

  private created() {
    this.reloadResource()
    this.loadResourceCategories()
  }

  private async reloadResource(current: number = 1) {
    this.form.current = current
    return this.loadResources()
  }

  private async loadResources() {
    this.isLoading = true

    const {
      data: {
        data: { records, total }
      }
    } = await getByPage(this.form)

    this.resources = records
    this.totalCount = total

    this.isLoading = false
  }

  private async loadResourceCategories() {
    const {
      data: { data }
    } = await getAllCategory()
    this.resourceCategories = data
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
}
</script>

<style lang="scss" scoped></style>
