<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        课程管理
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
            :disabled="courseLoading[row.id]"
            @change="handleStateChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button @click="handleSection(row)">
            内容管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[5, 10, 20]"
      :page-size="form.pageSize"
      :disabled="loading"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script lang="ts">
import { changeState, Course, CourseQuery, getByPage } from '@/services/course'
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
    pageSize: 20
  }
  private courses: Course[] = []
  private total: number = 0
  private loading: boolean = false
  private courseLoading: Record<number, boolean> = {}

  private created() {
    this.reloadData()
  }

  private async reloadData(current: number = 1) {
    this.form.currentPage = current
    return this.loadCourse()
  }

  private async loadCourse() {
    this.loading = true
    const {
      data: {
        data: { records, total }
      }
    } = await getByPage(this.form)
    this.loading = false

    this.courses = records
    this.total = total
  }

  private handleAdd() {
    this.$router.push({
      name: 'course-create'
    })
  }

  private handleEdit(course: Course) {
    this.$router.push({
      name: 'course-edit',
      params: {
        courseId: `${course.id}`
      }
    })
  }

  private handleSection(course: Course) {
    this.$router.push({
      name: 'course-section',
      params: {
        courseId: `${course.id}`
      }
    })
  }

  private async handleStateChange(course: Course) {
    this.$set(this.courseLoading, course.id, true)
    try {
      const {
        data: { data, code, mesg }
      } = await changeState(course.id, course.status)
      if (Number.parseInt(code)) {
        throw new Error(mesg)
      }
      this.$message.success(`${course.status ? '上架' : '下架'}成功`)
    } catch (error) {
      this.$message.error(`Error when change state: ${error}`)
      course.status = course.status ? 0 : 1
    } finally {
      this.$set(this.courseLoading, course.id, false)
    }
  }

  private handleFilter() {
    this.reloadData()
  }

  private handleCurrentChange(current: number) {
    this.reloadData(current)
  }

  private handleReset() {
    this.$refs.form.resetFields()
    this.reloadData()
  }
}
</script>

<style scoped></style>
