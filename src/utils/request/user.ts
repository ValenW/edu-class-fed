import request from './'
import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

const basePath = '/front/user'
const userRequest = (config: AxiosRequestConfig) => {
  return request({
    ...config,
    url: `${basePath}${config.url}`
  })
}

export const login = (data: { phone: string; password: string }) =>
  userRequest({
    method: 'POST',
    url: `/login`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(data)
  })
