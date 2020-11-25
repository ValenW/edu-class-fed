import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/resource'
const resourceRequest = buildRequestWithBaseUrl(baseUrl)

export type ResourceQueryParam = {
  id?: number
  name?: string
  startCreateTime?: string
  url?: string
  categoryId?: number
  endCreateTime?: string
  current?: number
  size?: number
}

export type Resource = {
  name: string
  categoryId: number
  id: number
  createdBy: string
  url: string
  description: string
  updatedBy: string
  createdTime: string
  selected: boolean
  updatedTime: string
}

export type ResourceCategory = {
  id: number
  createdBy: string
  updatedBy: string
  createdTime: string
  updatedTime: string
  name: string
  sort: number
  selected: boolean
}

export const getByPage = (data: ResourceQueryParam) =>
  resourceRequest({
    method: 'POST',
    url: '/getResourcePages',
    data
  })

export const getAllCategory = () =>
  resourceRequest({
    url: '/category/getAll'
  })
