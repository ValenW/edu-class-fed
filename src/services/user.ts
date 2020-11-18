import { buildRequestWithBaseUrl } from '../utils/request'
import qs from 'qs'
import axios from 'axios'

interface User {
  phone: string
  password: string
}

const basePath = '/front/user'
const userRequest = buildRequestWithBaseUrl(basePath)

export const login = (data: User) =>
  userRequest({
    method: 'POST',
    url: `/login`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })

export const userInfo = () =>
  userRequest({
    method: 'GET',
    url: `/getInfo`
  })

export const refreshToken = (refreshToken: string) => {
  // not use request to avoid response interceptors
  return axios.create()({
    method: 'POST',
    url: `${basePath}/refresh_token`,
    data: qs.stringify({ refreshtoken: refreshToken })
  })
}
