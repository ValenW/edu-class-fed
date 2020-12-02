export const initUploader = () =>
  new window.AliyunUpload.Vod({
    // 阿里账号ID，必须有值
    userId: process.env.VUE_APP_ALIYUN_ID,
    // 上传到视频点播的地域，默认值为'cn-shanghai'，// eu-central-1，ap-southeast-1
    region: 'cn-shanghai',
    // 分片大小默认1 MB，不能小于100 KB
    partSize: 1 * 1024 * 1024,
    // 并行上传分片个数，默认5
    parallel: 5,
    // 网络原因失败时，重新上传次数，默认为3
    retryCount: 3,
    // 网络原因失败时，重新上传间隔时间，默认为2秒
    retryDuration: 2,
    // 开始上传
    onUploadstarted: uploadInfo => {
      console.log('onUploadstarted', uploadInfo)
    },
    // 文件上传成功
    onUploadSucceed: uploadInfo => {
      console.log('onUploadSucceed', uploadInfo)
    },
    // 文件上传失败
    onUploadFailed: (uploadInfo, code, message) => {
      console.log('onUploadFailed', uploadInfo)
    },
    // 文件上传进度，单位：字节
    onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
      console.log('onUploadProgress', uploadInfo)
    },
    // 上传凭证超时
    onUploadTokenExpired: uploadInfo => {
      console.log('onUploadTokenExpired', uploadInfo)
    },
    // 全部文件上传结束
    onUploadEnd: uploadInfo => {
      console.log('onUploadEnd', uploadInfo)
    }
  })
