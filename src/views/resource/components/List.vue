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
            :disabled="loading"
          >
            查询搜索
          </el-button>
          <el-button @click="onReset" :disabled="loading">重置</el-button>
        </el-form-item>
      </el-form>

      <Table :loading="loading" :resources="resources" @edit="handleEdit" />

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

    <el-dialog>
      <!-- <update-dialog :visible="dialogVisible" :createMode="createMode" /> -->
    </el-dialog>
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
import UpdateDialog from '@/component/Update/dialog.vue'

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

  private async handleEdit(editMode: boolean = true) {
    // TODO
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
