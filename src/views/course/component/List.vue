<template>
  <el-card>
    <div slot="header">
      <div slot="header" class="clearfix">
        <el-row type="flex" justify="space-between">
          用户管理
          <div class="operations">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click="handleAdd"
            >
              新建课程
            </el-button>
          </div>
        </el-row>
      </div>
    </div>

    <el-form
      ref="form"
      inline
      label-width="70px"
      label-position="left"
      :model="form"
    >
      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="loading" @click="handleReset">重置</el-button>
        <el-button type="primary" :disabled="loading" @click="handleFilter">
          查询
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="courses"
      v-loading="loading"
      style="width: 100%; margin-bottom: 20px"
    >
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="courseName" label="课程名称"> </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column prop="sortNum" label="排序"> </el-table-column>
      <el-table-column prop="status" label="上架状态">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            :disabled="row.isStatusLoading"
            @change="onStateChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            @click="
              $router.push({
                name: 'course-edit',
                params: {
                  courseId: row.id
                }
              })
            "
          >
            编辑
          </el-button>
          <el-button
            @click="
              $router.push({
                name: 'course-section',
                params: {
                  courseId: row.id
                }
              })
            "
          >
            内容管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :disabled="loading"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script lang="ts">
import { Course, CourseQuery, getByPage } from '@/services/course'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'

@Component({
  components: {}
})
export default class List extends Vue {
  $refs!: {
    form: Form
  }
  private form: CourseQuery = {
    currentPage: 1,
    pageSize: 20,
    courseName: '',
    status: ''
  }
  private courses: Course[] = []
  private total: number = 0
  private loading: boolean = false

  private created() {
    this.loadCourse()
  }

  private async reloadData(current: number = 1) {
    this.form.currentPage = current
    return this.loadCourse()
  }

  private async loadCourse() {
    const {
      data: {
        data: { records, total }
      }
    } = await getByPage(this.form)
    this.courses = records
    this.total = total
  }

  private handleAdd() {
    // TODO
  }

  private handleReset() {
    this.$refs.form.resetFields()
    this.reloadData()
  }

  private handleFilter() {
    this.reloadData()
  }

  private handleCurrentChange(current: number) {
    this.reloadData(current)
  }
}
</script>

<style scoped></style>
