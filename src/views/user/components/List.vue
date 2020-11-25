<template>
  <el-card>
    <div slot="header">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          用户管理
        </el-row>
      </div>
    </div>

    <el-form :model="form" inline ref="form">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="注册时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="loading" @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleQuery" :disabled="loading">
          查询
        </el-button>
      </el-form-item>
    </el-form>

    <el-table :data="users" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="用户ID" width="100"> </el-table-column>
      <el-table-column prop="name" label="头像" width="80">
        <template slot-scope="scope">
          <img width="30px" :src="scope.row.portrait || defaultAvatarUrl" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column prop="name" label="状态">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="updatingStatus[row.id]"
            @change="toggleUserEnable(row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleSelectRole(row)">
            分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      :disabled="loading"
      :current-page.sync="form.currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="400px">
      <el-select
        v-model="roleIdList"
        multiple
        clearable
        size="medium"
        placeholder="请选择"
        width="100%"
      >
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssignRole">确定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import {
  enableUser,
  forbidUser,
  getByPage,
  User,
  UserQueryParam
} from '@/services/user'
import { assignRolesToUser, getAll, getUserRole, Role } from '@/services/role'
import { safeDate } from '@/utils'
import { Form } from 'element-ui'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { use } from 'vue/types/umd'

@Component({
  components: {}
})
export default class List extends Vue {
  $refs!: {
    form: Form
  }

  private defaultAvatarUrl =
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
  private loading: boolean = false
  private total: number = 0
  private users: User[] = []
  private form: UserQueryParam & { dateRange: [string, string] } = {
    pageSize: 10,
    currentPage: 1,
    startCreateTime: undefined,
    endCreateTime: undefined,
    get dateRange(): [string, string] {
      if (this.startCreateTime && this.endCreateTime) {
        return [
          this.startCreateTime.toISOString(),
          this.endCreateTime.toISOString()
        ]
      }
      return ['', '']
    },

    set dateRange(data: [string, string]) {
      this.startCreateTime = (data && safeDate(data[0])) || undefined
      this.endCreateTime = (data && safeDate(data[1])) || undefined
    }
  }

  private dialogVisible: boolean = false
  private roles: Role[] = []
  private roleIdList: number[] = []
  private editingUserId: number = 0

  private updatingStatus: { [key: string]: boolean } = {}

  private created() {
    this.loadUsers()
    this.loadRoles()
  }

  private async loadUsers() {
    this.loading = true

    const {
      data: {
        data: { records: users, total }
      }
    } = await getByPage(this.form)
    this.users = users
    this.total = total

    this.loading = false
  }

  private async loadRoles() {
    const {
      data: { data: roles }
    } = await getAll()
    this.roles = roles
  }

  private async handleSelectRole(user: User) {
    this.editingUserId = user.id
    const {
      data: { data: roleIds }
    } = await getUserRole(user.id)
    this.roleIdList = roleIds.map((r: Role) => r.id)
    this.dialogVisible = true
  }

  private async handleAssignRole() {
    const {
      data: { code, mesg }
    } = await assignRolesToUser(this.editingUserId, this.roleIdList)
    if (Number.parseInt(code)) {
      this.$message.error(`更新角色出错, 请联系管理员. 出错信息: ${mesg}`)
    }
    this.dialogVisible = false
  }

  private async toggleUserEnable(user: User) {
    this.$set(this.updatingStatus, user.id, true)
    this.editingUserId = user.id
    try {
      const {
        data: { code, mesg }
      } =
        user.status === 'DISABLE'
          ? await forbidUser(user.id)
          : await enableUser(user.id)
      if (Number.parseInt(code)) {
        throw new Error(mesg)
      }
    } catch (error) {
      this.$message.error(`禁用/启用用户失败, 请联系管理员. 错误信息: ${error}`)
      user.status = user.status === 'DISABLE' ? 'ENABLE' : 'DISABLE'
    } finally {
      this.$set(this.updatingStatus, user.id, false)
    }
  }

  private handleQuery() {
    this.reloadData()
  }

  private handleReset() {
    this.$refs.form.resetFields()
    this.reloadData()
  }

  private onSizeChange(val: number) {
    this.form.pageSize = val
    this.reloadData()
  }

  private onCurrentChange(val: number) {
    this.reloadData(val)
  }

  private reloadData(current: number = 1) {
    this.form.currentPage = current
    this.loadUsers()
  }
}
</script>

<style scoped></style>
