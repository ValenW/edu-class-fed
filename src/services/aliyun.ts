import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/course/upload'
const aliyunRequest = buildRequestWithBaseUrl(baseUrl)

type TransCodeForm = Partial<{
  id: number
  courseId: number
  sectionId: number
  lessonId: number
  channel: number
  mediaType: number
  coverImageUrl: string
  duration: string
  fileId: string
  fileUrl: string
  fileEdk: string
  fileSize: number
  fileName: string
  fileDk: string
  createTime: string
  updateTime: string
  status: number
  isDel: true
  lastOperatorId: number
  durationNum: number
}>

type AddressAuthInfo = {
  requestId: string
  uploadAddress: string
  uploadAuth: string
}
type VideoAddressAuth = AddressAuthInfo & {
  videoId: string
}
type ImageAddressAuth = AddressAuthInfo & {
  fileURL: string
  imageId: string
  imageURL: string
}

export const getUploadImageAddressAuth = () =>
  aliyunRequest({
    url: '/aliyunImagUploadAddressAdnAuth.json'
  })

export const getUploadVideoAddressAuth = (
  fileName: string,
  imageUrl?: string
) =>
  aliyunRequest({
    url: '/aliyunVideoUploadAddressAdnAuth.json',
    params: { fileName, imageUrl }
  })

export const transCode = (data: TransCodeForm) =>
  aliyunRequest({
    url: '/aliyunTransCode.json',
    method: 'POST',
    data
  })

export const transCodePercent = (lessonId: string) =>
  aliyunRequest({
    url: '/aliyunTransCodePercent.json',
    params: { lessonId }
  })
