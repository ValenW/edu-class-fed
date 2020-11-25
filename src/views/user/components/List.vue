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
          <img
            width="30px"
            :src="
              scope.row.portrait ||
                'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="createTime" label="注册时间" />
      <el-table-column prop="name" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleSelectRole(scope.row)">
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

    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="50%">
      <el-select v-model="roleIdList" multiple placeholder="请选择">
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
        <el-button type="primary" @click="handleAllocRole">确定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { getByPage, User, UserQueryParam } from '@/services/user'
import { Role } from '@/services/role'
import { safeDate } from '@/utils'
import { Form } from 'element-ui'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class List extends Vue {
  $refs!: {
    form: Form
  }
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

  private loading: boolean = false
  private dialogVisible: boolean = false
  private roles: Role[] = []
  private roleIdList: number[] = []
  private currentUser?: User // 分配角色的当前用户
  private total: number = 0

  private created() {
    this.loadUsers()
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

  private async handleForbidUser(user: any) {}

  private handleQuery() {
    this.reloadData()
  }

  private handleReset() {
    this.$refs.form.resetFields()
    this.reloadData()
  }

  private async handleSelectRole(role: any) {}

  private async handleAllocRole() {}

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
