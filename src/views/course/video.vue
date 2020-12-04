<template>
  <el-card>
    <div slot="header" class="clearfix">
      <el-row type="flex" justify="space-between">
        <span>
          <el-button
            icon="el-icon-arrow-left"
            size="mini"
            @click="$router.back()"
            type="text"
          >
            返回
          </el-button>
          <el-divider direction="vertical"></el-divider>
          课时视频上传
        </span>
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

        <div class="upload-progress">
          <p>图片上传状态: {{ stateToText(uploadState.image) }}</p>
          <p>视频上传状态: {{ stateToText(uploadState.video) }}</p>
          <p v-if="uploadState.video.state === 'Success'">
            视频转码状态: {{ stateToText(uploadState.transCode, '转码') }}
          </p>
        </div>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">开始上传</el-button>
          <el-button @click="() => $router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import {
  getUploadImageAddressAuth,
  getUploadVideoAddressAuth,
  transCode,
  transCodePercent
} from '@/services/aliyun'
import { getById, uploadImage } from '@/services/course'
import { getLessonById } from '@/services/section'
import { buildAcceptStr, ImageTypes, VideoTypes } from '@/utils'
import { initUploader, UploadInfo } from '@/utils/aliyun'
import { Vue, Component, Prop } from 'vue-property-decorator'

type State = 'Ready' | 'Doing' | 'Success' | 'Failed'
type ProgressState = { state: State; percentage: number }

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
  private uploader = initUploader({
    onUploadStarted: this.onUploadStarted.bind(this),
    onUploadProgress: this.onUploadProgress.bind(this),
    onUploadEnd: this.onUploadEnd.bind(this)
  })
  private uploadState: {
    image: ProgressState
    video: ProgressState
    transCode: ProgressState
  } = {
    image: { state: 'Ready', percentage: 0 },
    video: { state: 'Ready', percentage: 0 },
    transCode: { state: 'Ready', percentage: 0 }
  }
  private imageUrl: string = ''
  private videoId: string = ''
  private videoName: string = ''

  private stateToText = (
    { state, percentage }: ProgressState,
    actionName: string = '上传'
  ): string => {
    switch (state) {
      case 'Ready':
        return `准备${actionName}`
      case 'Doing':
        return `${actionName}中: ${percentage}%`
      case 'Success':
        return `${actionName}成功`
      case 'Failed':
        return `${actionName}失败`
    }
  }

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

    const paramData = JSON.stringify({ Vod: {} })
    this.uploader.addFile(video, null, null, null, paramData)
    this.uploader.addFile(image, null, null, null, paramData)
    this.uploader.startUpload()
  }

  private async onUploadStarted(uploadInfo: UploadInfo) {
    if (uploadInfo.isImage) {
      this.uploadImage(uploadInfo)
    } else {
      this.uploadVideo(uploadInfo)
    }
  }

  private async uploadVideo(uploadInfo: UploadInfo) {
    const {
      data: {
        data: { videoId, uploadAddress, uploadAuth }
      }
    } = await getUploadVideoAddressAuth((this.videoName = uploadInfo.file.name))

    this.uploader.setUploadAuthAndAddress(
      uploadInfo,
      uploadAuth,
      uploadAddress,
      videoId
    )
    this.videoId = videoId

    this.uploadState.video.state = 'Doing'
  }

  private async uploadImage(uploadInfo: UploadInfo) {
    const {
      data: {
        data: { imageId, imageURL, uploadAddress, uploadAuth }
      }
    } = await getUploadImageAddressAuth()

    this.uploader.setUploadAuthAndAddress(
      uploadInfo,
      uploadAuth,
      uploadAddress,
      imageId
    )
    this.imageUrl = imageURL

    this.uploadState.image.state = 'Doing'
  }

  private onUploadProgress(
    uploadInfo: UploadInfo,
    totalSize: number,
    loadedPercent: number
  ) {
    const state = uploadInfo.isImage
      ? this.uploadState.image
      : this.uploadState.video
    state.state = 'Doing'
    state.percentage = loadedPercent * 100
    if (state.percentage === 100) {
      state.state = 'Success'
    }
  }

  private onUploadEnd() {
    this.startTransCode()
  }

  private async startTransCode() {
    const {
      data: { data }
    } = await transCode({
      lessonId: Number(this.lessonId),
      fileId: this.videoId,
      coverImageUrl: this.imageUrl,
      fileName: this.videoName
    })

    if (data) {
      this.uploadState.transCode.state = 'Doing'
      const intervalId = setInterval(async () => {
        const {
          data: { data }
        } = await transCodePercent(this.lessonId)

        this.uploadState.transCode.percentage = data * 100
        if (data === 1) {
          this.uploadState.transCode.state = 'Success'
          clearInterval(intervalId)
        }
      }, 3000)
    }
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
