<template>
  <el-upload
    :accept="accept"
    class="uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeUpload"
    :http-request="handleRequest"
  >
    <img v-if="value" :src="value" class="img" />
    <i v-else class="el-icon-plus uploader-icon"></i>
  </el-upload>
</template>

<script lang="ts">
import { uploadImage } from '@/services/course'
import {
  ElUploadInternalRawFile,
  HttpRequestOptions
} from 'element-ui/types/upload'
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Uploader extends Vue {
  @Prop({ type: Array, required: false, default: [] })
  private acceptTypes!: string[]

  @Prop({ type: Number, required: false, default: 2 * 1024 * 1024 })
  private limit!: number

  @Prop({ type: String, default: '' })
  private value!: string

  private uploading: boolean = false

  private beforeUpload(file: ElUploadInternalRawFile) {
    const isLt2M = file.size / 1024 / 1024 < this.limit

    if (!isLt2M) {
      this.$message.error(`上传头像图片大小不能超过 ${this.limit}MB!`)
    }
    return isLt2M
  }

  private async handleRequest(options: HttpRequestOptions) {
    this.uploading = true
    try {
      const fd = new FormData()
      fd.append('file', options.file)

      const {
        data: {
          data: { code, mesg, name }
        },
        data: res
      } = await uploadImage(fd)
      if (Number.parseInt(code)) {
        throw new Error('mesg')
      }
      this.$emit('input', name)
    } catch (error) {
      this.$message.error(`上传失败: ${error}`)
    } finally {
      this.uploading = false
    }
  }

  private get accept(): string {
    return this.acceptTypes.map(t => `.${t.toLowerCase()}`).join(', ')
  }
}
</script>

<style scoped>
.uploader ::v-deep .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader ::v-deep .el-upload:hover {
  border-color: #409eff;
}
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.img {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
