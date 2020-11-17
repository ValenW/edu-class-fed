import request from './'
import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

interface User {
  phone: string
  password: string
}

const basePath = '/front/user'
const userRequest = (config: AxiosRequestConfig) => {
  return request({
    ...config,
    url: `${basePath}${config.url}`
  })
}

export const login = (data: User) =>
  userRequest({
    method: 'POST',
    url: `/login`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
