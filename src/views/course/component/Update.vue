<template>
  <div class="update-course">
    <el-steps :active="activeStep" simple>
      <el-step
        v-for="(step, index) in steps"
        :title="step.title"
        :icon="step.icon"
        :key="index"
        @click.native="activeStep = index"
      />
    </el-steps>

    <el-form label-width="80px">
      <div class="step-wrapper" v-show="activeStep === 0">
        <el-form-item label="课程名称">
          <el-input v-model="course.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程简介">
          <el-input v-model="course.brief"></el-input>
        </el-form-item>
        <el-form-item label="课程概述">
          <el-input
            style="margin-bottom: 10px"
            v-model="course.previewFirstField"
            type="textarea"
            placeholder="概述1"
          />
          <el-input
            v-model="course.previewSecondField"
            type="textarea"
            placeholder="概述2"
          />
        </el-form-item>
        <el-form-item label="讲师姓名">
          <el-input v-model="course.teacherDTO.teacherName" />
        </el-form-item>
        <el-form-item label="讲师简介">
          <el-input v-model="course.teacherDTO.description" />
        </el-form-item>
        <el-form-item label="课程排序">
          <el-input-number v-model="course.sortNum" label="描述文字" />
        </el-form-item>
      </div>
      <div class="step-wrapper" v-show="activeStep === 1">
        <el-form-item label="课程封面">
          <Uploader
            v-model="course.courseListImg"
            :limit="2"
            :acceptTypes="imageTypes"
          />
        </el-form-item>
        <el-form-item label="介绍封面">
          <Uploader
            v-model="course.courseImgUrl"
            :limit="2"
            :acceptTypes="imageTypes"
          />
        </el-form-item>
      </div>
      <div class="step-wrapper" v-show="activeStep === 2">
        <el-form-item label="售卖价格">
          <el-input v-model.number="course.discounts" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品原价">
          <el-input v-model.number="course.price" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model.number="course.sales" type="number">
            <template slot="append">单</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动标签">
          <el-input v-model="course.discountsTag"></el-input>
        </el-form-item>
      </div>
      <div class="step-wrapper" v-show="activeStep === 3">
        <el-form-item label="秒杀开关">
          <el-switch
            v-model="course.activityCourse"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
        <template v-if="course.activityCourse">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="course.activityCourseDTO.beginTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="course.activityCourseDTO.endTime"
              type="date"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="秒杀价">
            <el-input
              v-model.number="course.activityCourseDTO.amount"
              type="number"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="秒杀库存">
            <el-input
              v-model.number="course.activityCourseDTO.stock"
              type="number"
            >
              <template slot="append">个</template>
            </el-input>
          </el-form-item>
        </template>
      </div>
      <div class="step-wrapper" v-show="activeStep === 4">
        <el-form-item label="课程详情">
          <TextEditor v-model="course.courseDescriptionMarkDown" />
        </el-form-item>
        <el-form-item label="是否发布">
          <el-switch
            v-model="course.status"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button v-if="activeStep < steps.length - 1" @click="activeStep++">
          下一步
        </el-button>
        <el-button v-else type="primary" @click="handleSubmit">
          {{ updateTitle }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Uploader from './Uploader.vue'
import TextEditor from '@/component/TextEditor/index.vue'
import { CourseInput, saveOrUpdate, getById } from '@/services/course'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: { Uploader, TextEditor }
})
export default class Update extends Vue {
  @Prop({ type: Boolean, required: true })
  private createMode!: boolean

  @Prop({ required: false })
  private courseId!: number

  private steps: { icon: string; title: string }[] = [
    { title: '基本信息', icon: 'el-icon-edit' },
    { title: '课程封面', icon: 'el-icon-picture' },
    { title: '销售信息', icon: 'el-icon-goods' },
    { title: '秒杀活动', icon: 'el-icon-alarm-clock' },
    { title: '课程详情', icon: 'el-icon-edit-outline' }
  ]
  private activeStep: number = 0
  private course: Partial<CourseInput> = this.buildCourseInput({})
  private imageTypes: string[] = ['bmp', 'jpg', 'jpeg', 'png', 'gif']

  private mounted() {
    if (!this.createMode && this.courseId) {
      this.loadData(this.courseId)
    }
  }

  private async loadData(courseId: number) {
    try {
      const {
        data: { code, mesg, data }
      } = await getById(courseId)
      if (Number.parseInt(code)) {
        throw new Error(mesg)
      }

      this.course = this.buildCourseInput(data)
    } catch (error) {
      this.$message.error(`加载课程信息出错: ${error}`)
    }
  }

  private buildCourseInput(course: Partial<CourseInput>): Partial<CourseInput> {
    if (!course.activityCourseDTO) {
      course.activityCourseDTO = {}
    }
    if (!course.teacherDTO) {
      course.teacherDTO = {}
    }
    if (course.activityCourse === undefined) {
      course.activityCourse = false
    }
    return course
  }

  private async handleSubmit() {
    try {
      const {
        data: { code, mesg, data },
        data: res
      } = await saveOrUpdate(this.course)
      console.log(res, data)

      if (Number.parseInt(code)) {
        throw new Error(mesg)
      }
      this.$router.push({ name: 'course' })
    } catch (error) {
      this.$message.error(`更新错误: ${error}`)
    }
  }

  private get updateTitle(): string {
    return `${this.createMode ? '创建' : '更新'}课程`
  }
}
</script>

<style scoped>
.step-wrapper {
  margin-top: 10px;
}
</style>
