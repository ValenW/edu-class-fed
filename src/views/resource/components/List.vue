<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px">
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
              @click="reloadResource"
              :disabled="isLoading"
            >
              查询搜索
            </el-button>
            <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="resources"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column type="index" label="编号"> </el-table-column>
        <el-table-column prop="name" label="资源名称"> </el-table-column>
        <el-table-column prop="url" label="资源路径"> </el-table-column>
        <el-table-column prop="description" label="描述"> </el-table-column>
        <el-table-column prop="createdTime" label="添加时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import {
  getAllCategory,
  getByPage,
  Resource,
  ResourceCategory,
  ResourceQueryParam
} from '@/services/resource'

@Component
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

  private handleEdit(item: any) {
    console.log('handleEdit', item)
  }

  private handleDelete(item: any) {
    console.log('handleDelete', item)
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
