import qs from 'qs'
import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/role'
const roleRequest = buildRequestWithBaseUrl(baseUrl)

export type Role = {
  code: string
  id: number
  name: string
  createdBy: string
  description: string
  updatedBy: string
  createdTime: string
  updatedTime: string
}

export type RoleQueryParam = {
  code?: string
  id?: number
  name?: string
  startCreateTime?: string
  endCreateTime?: string
  current?: number
  size?: number
}

export const getByPage = (data: RoleQueryParam) =>
  roleRequest({
    url: '/getRolePages',
    method: 'POST',
    data
  })
