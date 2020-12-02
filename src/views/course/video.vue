<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        课时视频上传
        <div class="operations"></div>
      </el-row>
    </div>

    <el-form>
      <el-form ref="form" label-width="80px">
        <el-form-item label="课程">
          <el-input :value="courseName" disabled required />
        </el-form-item>
        <el-form-item label="课时">
          <el-input :value="lessonName" disabled required />
        </el-form-item>
        <el-form-item label="视频上传" required>
          <input type="file" ref="videoInput" :accept="acceptVideo" />
        </el-form-item>
        <el-form-item label="封面上传" required>
          <input type="file" ref="imageInput" :accept="acceptImage" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">开始上传</el-button>
          <el-button @click="() => $router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { getById } from '@/services/course'
import { getLessonById } from '@/services/section'
import { buildAcceptStr, ImageTypes, VideoTypes } from '@/utils'
import { initUploader } from '@/utils/aliyun'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class CourseVideo extends Vue {
  $refs!: {
    videoInput: HTMLInputElement
    imageInput: HTMLInputElement
  }
  @Prop({ type: String, required: true })
  private courseId!: string

  @Prop({ type: String, required: true })
  private lessonId!: string

  private courseName: string = ''
  private lessonName: string = ''
  private uploader = initUploader()

  private async created() {
    const [
      {
        data: {
          data: { courseName }
        }
      },
      {
        data: {
          data: { theme }
        }
      }
    ] = await Promise.all([
      getById(this.courseId),
      getLessonById(this.lessonId)
    ])

    this.courseName = courseName
    this.lessonName = theme
  }

  private onSubmit() {
    const video = this.$refs.videoInput.files && this.$refs.videoInput.files[0]
    const image = this.$refs.imageInput.files && this.$refs.imageInput.files[0]
    if (!video || !image) {
      this.$message.error('请选择视频和封面')
      return
    }

    console.log(video, image)

    // TODO
  }

  private get acceptImage(): string {
    return buildAcceptStr(ImageTypes)
  }

  private get acceptVideo(): string {
    return buildAcceptStr(VideoTypes)
  }
}
</script>

<style scoped></style>
