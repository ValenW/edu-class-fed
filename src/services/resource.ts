import { buildRequestWithBaseUrl } from '@/utils/request'

const resourceUrl = '/boss/resource'
const resourceRequest = buildRequestWithBaseUrl(resourceUrl)
const categoryUrl = '/boss/resource/category'
const categoryRequest = buildRequestWithBaseUrl(categoryUrl)

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
  resourceList?: Resource[]
}

export type ResourceUpdateForm = {
  id?: number
  name: string
  categoryId: number
  url: string
  description?: string
}
export type CategoryUpdateForm = {
  id: number
  name: string
  sort: number
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

export const getAllResource = () =>
  resourceRequest({
    url: '/getAll'
  })

export const getByRole = (roleId: string | number) =>
  resourceRequest({
    url: '/getRoleResources',
    params: { roleId }
  })

export const assignResourceToRole = (
  resourceIdList: number[],
  roleId: number | string
) =>
  resourceRequest({
    url: '/allocateRoleResources',
    method: 'POST',
    data: { resourceIdList, roleId }
  })

export const updateResource = (data: ResourceUpdateForm) =>
  resourceRequest({
    url: '/saveOrUpdate',
    method: 'POST',
    data
  })

export const deleteResource = (id: string | number) =>
  resourceRequest({
    url: `/${id}`,
    method: 'DELETE'
  })

export const updateCategory = (data: CategoryUpdateForm) =>
  categoryRequest({
    url: '/saveOrderUpdate',
    method: 'POST',
    data
  })

export const deleteCategory = (id: string | number) =>
  categoryRequest({
    url: `/${id}`,
    method: 'DELETE'
  })
