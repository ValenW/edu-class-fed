<template>
  <div class="role-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          角色管理
          <div class="operations">
            <el-button size="mini" @click="handleAdd">添加角色</el-button>
          </div>
        </el-row>
      </div>

      <el-form ref="form" inline :model="form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :disabled="loading">
            查询搜索
          </el-button>
          <el-button :disabled="loading" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>

      <Table
        :loading="loading"
        :roles="roles"
        @edit="handleEdit"
        @update="loadData()"
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
      :name="'角色'"
      :updateMethod="updateMethod"
      @update="loadData()"
    />
  </div>
</template>

<script lang="ts">
import Table from './Table.vue'
import UpdateDialog from '@/component/Update/dialog.vue'
import {
  deleteRole,
  getByPage,
  Role,
  RoleQueryParam,
  updateRole
} from '@/services/role'
import { Form } from 'element-ui'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { FormConfig } from '@/component/Update/index.vue'

@Component({
  components: { Table, UpdateDialog }
})
export default class RoleList extends Vue {
  $refs!: {
    form: Form
  }
  private roles: Role[] = []
  private form: RoleQueryParam = {
    name: '',
    current: 1,
    size: 20
  }
  private roleId?: number
  private loading: boolean = false
  private total: number = 0

  private dialogVisible: boolean = false
  private createMode: boolean = false
  private config: FormConfig[] = [
    { prop: 'name', label: '角色名称', type: 'text' },
    { prop: 'code', label: '角色编码', type: 'text' },
    { prop: 'description', label: '描述', type: 'textarea' }
  ]
  private init: FormData & any = {}
  private updateMethod = updateRole

  private created() {
    this.loadData()
  }

  private async loadData() {
    this.loading = true
    const {
      data: {
        data: { records, total }
      }
    } = await getByPage(this.form)
    this.roles = records
    this.total = total
    this.loading = false
  }

  private handleAdd() {
    this.handleEdit()
  }

  private async handleEdit(item?: Role) {
    this.createMode = !item
    this.dialogVisible = true
    this.init = item || {}
  }

  private onSubmit() {
    this.loadData()
  }

  private onReset() {
    this.$refs.form.resetFields()
    this.reloadData()
  }

  private onSizeChange(val: number) {
    this.form.size = val
    this.reloadData()
  }

  private onCurrentChange(val: number) {
    this.reloadData(val)
  }

  private reloadData(current: number = 1) {
    this.form.current = current
    this.loadData()
  }
}
</script>

<style scoped></style>
