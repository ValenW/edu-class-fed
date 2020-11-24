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
export const getByPage = (data: ResourceQueryParam) =>
  resourceRequest({
    method: 'POST',
    url: '/getResourcePages',
    data
  })
