import { buildRequestWithBaseUrl } from '../utils/request'
import qs from 'qs'
import axios from 'axios'

interface RegisterInfo {
  phone: string
  password: string
}
export interface User {
  id: number
  name: string
  portrait: string
  phone: string
  password: string
  regIp: string
  accountNonExpired: boolean
  credentialsNonExpired: boolean
  accountNonLocked: boolean
  status: 'DISABLE' | 'ENABLE'
  isDel: boolean
  createTime: string
  updateTime: string
}

export type UserQueryParam = {
  currentPage?: number
  pageSize?: number
  phone?: string
  userId?: number
  startCreateTime?: Date
  endCreateTime?: Date
}

const authPath = '/front/user'
const authRequest = buildRequestWithBaseUrl(authPath)
const userPath = '/boss/user'
const userRequest = buildRequestWithBaseUrl(userPath)

export const login = (data: RegisterInfo) =>
  authRequest({
    method: 'POST',
    url: `/login`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })

export const userInfo = () =>
  authRequest({
    method: 'GET',
    url: `/getInfo`
  })

export const refreshToken = (refreshToken: string) => {
  // not use request to avoid response interceptors
  return axios.create()({
    method: 'POST',
    url: `${authPath}/refresh_token`,
    data: qs.stringify({ refreshtoken: refreshToken })
  })
}

export const getByPage = (data: UserQueryParam) =>
  userRequest({
    url: '/getUserPages',
    method: 'POST',
    data: {
      ...data,
      startCreateTime:
        (data.startCreateTime && data.startCreateTime.toISOString()) ||
        undefined,
      endCreateTime:
        (data.endCreateTime && data.endCreateTime.toISOString()) || undefined
    }
  })

export const forbidUser = (userId: number) =>
  userRequest({
    url: '/forbidUser',
    params: { userId }
  })

export const enableUser = (userId: number) =>
  userRequest({
    url: '/enableUser',
    params: { userId }
  })
