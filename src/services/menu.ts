import request, { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/menu'
const menuRequest = buildRequestWithBaseUrl(baseUrl)

export interface MenuForm {
  id?: number
  parentId: number
  name: string
  href: string
  icon?: string
  orderNum?: number
  description?: string
  shown?: boolean
}

export const createOrUpdateMenu = (data: MenuForm) =>
  menuRequest({
    method: 'POST',
    url: '/saveOrUpdate',
    data
  })
