import request, { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/menu'
const menuRequest = buildRequestWithBaseUrl(baseUrl)

export interface Menu {
  id: number
  name: string
  createdBy: string
  createdTime: string
  description: string
  href: string
  icon: string
  level: number
  orderNum: number
  parentId: number
  selected: boolean
  shown: boolean
  subMenuList: Menu[]
  updatedBy: string
  updatedTime: string
}
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

export const getEditMenuInfo = (id: string = '-1') =>
  menuRequest({
    url: '/getEditMenuInfo',
    params: { id }
  })
