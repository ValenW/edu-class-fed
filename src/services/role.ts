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

export type RoleForm = {
  id?: number
  code: string
  name: string
  description?: string
}

export const getByPage = (data: RoleQueryParam) =>
  roleRequest({
    url: '/getRolePages',
    method: 'POST',
    data
  })

export const getAll = () =>
  roleRequest({
    url: '/all'
  })

export const getUserRole = (userId: number | string) =>
  roleRequest({
    url: `/user/${userId}`
  })

export const assignRolesToUser = (userId: number, roleIdList: number[]) =>
  roleRequest({
    url: 'allocateUserRoles',
    method: 'POST',
    data: { userId, roleIdList }
  })

export const updateRole = (data: RoleForm) =>
  roleRequest({
    url: '/saveOrUpdate',
    method: 'POST',
    data
  })

export const deleteRole = (id: string | number) =>
  roleRequest({
    url: `/${id}`,
    method: 'DELETE'
  })
