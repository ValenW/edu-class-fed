export type UploadInfo = {
  file: File
  fileHash: string
  isImage: boolean
  retry: boolean
  ri: string
  state: string
  userData: string
  videoInfo: any
}

export type UploaderConfig = {
  // 阿里账号ID，必须有值
  userId: string
  // 上传到视频点播的地域，默认值为'cn-shanghai'，// eu-central-1，ap-southeast-1
  region: string
  // 分片大小默认1 MB，不能小于100 KB
  partSize: number
  // 并行上传分片个数，默认5
  parallel: number
  // 网络原因失败时，重新上传次数，默认为3
  retryCount: number
  // 网络原因失败时，重新上传间隔时间，默认为2秒
  retryDuration: number
  // 开始上传
  onUploadStarted: (uploadInfo: UploadInfo) => void
  // 文件上传成功
  onUploadSucceed: (uploadInfo: UploadInfo) => void
  // 文件上传失败
  onUploadFailed: (
    uploadInfo: UploadInfo,
    code: number,
    message: string
  ) => void
  // 文件上传进度，单位：字节
  onUploadProgress: (
    uploadInfo: UploadInfo,
    totalSize: number,
    loadedPercent: number
  ) => void
  // 上传凭证超时
  onUploadTokenExpired: (uploadInfo: UploadInfo) => void
  // 全部文件上传结束
  onUploadEnd: (uploadInfo: UploadInfo) => void
}

const DefaultConfig: UploaderConfig = {
  userId: process.env.VUE_APP_ALIYUN_ID,
  region: 'cn-shanghai',
  partSize: 1 * 1024 * 1024,
  parallel: 5,
  retryCount: 3,
  retryDuration: 2,
  onUploadStarted: uploadInfo => {
    console.log('onUploadStarted', uploadInfo)
  },
  onUploadSucceed: uploadInfo => {
    console.log('onUploadSucceed', uploadInfo)
  },
  onUploadFailed: (uploadInfo, code, message) => {
    console.log('onUploadFailed', uploadInfo)
  },
  onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
    console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
  },
  onUploadTokenExpired: uploadInfo => {
    console.log('onUploadTokenExpired', uploadInfo)
  },
  onUploadEnd: uploadInfo => {
    console.log('onUploadEnd', uploadInfo)
  }
}

export const initUploader = (config: Partial<UploaderConfig>) => {
  const uploader = new window.AliyunUpload.Vod({
    ...DefaultConfig,
    ...config,
    onUploadstarted: config.onUploadStarted || DefaultConfig.onUploadStarted
  })

  return uploader
}
