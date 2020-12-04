import { buildRequestWithBaseUrl } from '@/utils/request'

const adUrl = '/front/ad/'
const adSpaceUrl = '/front/ad/space/'
const adRequest = buildRequestWithBaseUrl(adUrl)
const adSpaceRequest = buildRequestWithBaseUrl(adSpaceUrl)

export type AdSpace = {
  id: number
  name: string
  spaceKey: string
  createTime: string
  updateTime: string
  isDel: number
  adDTOList: Ad[]
}

export type Ad = {
  id: number
  name: string
  spaceId: number
  keyword: string
  htmlContent: string
  text: string
  img: string
  link: string
  startTime: string
  endTime: string
  createTime: string
  updateTime: string
  status: number
  priority: number
  startTimeFormatString: string
  endTimeFormatString: string
}

export type AdForm = Partial<Ad>
export type AdSpaceForm = {
  id?: number
  name: string
}

export const getAd = () =>
  adRequest({
    url: '/getAdList'
  })

export const updateAd = (data: AdForm) =>
  adRequest({
    url: '/saveOrUpdate',
    method: 'POST',
    data
  })

export const getSpace = () =>
  adSpaceRequest({
    url: '/getAllSpaces'
  })

export const updateSpace = (data: AdSpaceForm) =>
  adSpaceRequest({
    url: '/saveOrUpdate',
    method: 'POST',
    data
  })
