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

      <Table :roles="roles" :loading="loading" />

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

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <create-or-edit
        v-if="dialogVisible"
        :role-id="roleId"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Table from './Table.vue'
import { getByPage, Role, RoleQueryParam } from '@/services/role'
import { Form } from 'element-ui'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { Table }
})
export default class RoleList extends Vue {
  $refs!: {
    form: Form
  }
  private roles: Role[] = []
  private form: RoleQueryParam = {
    name: ''
  }
  private roleId?: number
  private loading: boolean = false
  private dialogVisible: boolean = false
  private isEdit: boolean = false
  private total: number = 0

  private created() {
    this.loadRoles()
  }

  private async loadRoles() {
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

  private onSuccess() {
    // this.dialogVisible = false
    // this.loadRoles()
  }

  private handleAdd() {
    // this.isEdit = false
    // this.dialogVisible = true
  }

  private onSubmit() {
    this.loadRoles()
  }

  private onReset() {
    this.$refs.form.resetFields()
    this.loadRoles()
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
    this.loadRoles()
  }
}
</script>

<style scoped></style>
