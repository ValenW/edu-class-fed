import router from '@/router'
import { refreshToken } from '@/services/user'
import store from '@/store'
import axios, { AxiosRequestConfig } from 'axios'
import { Message } from 'element-ui'

const request = axios.create({
  // add base config
})

request.interceptors.request.use(config => {
  if (store.state.user && store.state.user.access_token) {
    config.headers.Authorization = store.state.user.access_token
  }

  return config
})

request.interceptors.response.use(
  res => res,
  async err => {
    if (err.response) {
      // 收到响应但状态码错误
      const { status } = err.response
      switch (status) {
        case 400:
          Message.error('请求参数错误')
          break
        case 401:
          // token无效, 未提供, 过期等
          if (await tryUpdateToken()) {
            return request(err.config)
          }
          return Promise.reject(err)
        case 403:
          Message.error('没有权限, 请联系管理员')
          break
        case 404:
          Message.error('请求资源不存在, 请联系管理员')
          break
        default:
          Message.error('服务端错误, 请联系管理员')
          break
      }
    } else if (err.request) {
      // 未收到响应
      Message.error('请求超时, 请重试')
    } else {
      // 在设置请求时触发错误
      Message.error(`请求失败: ${err.message}`)
    }
    return Promise.reject(err)
  }
)

const tryUpdateToken = async () => {
  const tokenForRefresh =
    (store.state.user && store.state.user.refresh_token) || null
  if (!tokenForRefresh) {
    redirectLogin()
    return false
  }

  try {
    const {
      data: { success, content, message }
    } = await refreshToken(tokenForRefresh)
    if (!success) {
      throw message
    }

    store.commit('setUser', JSON.parse(content))
    return true
  } catch (error) {
    store.commit('setUser', null)
    redirectLogin()
    return false
  }
}

const redirectLogin = () => {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request

export const buildRequestWithBaseUrl = (basePath: string) => (
  config: AxiosRequestConfig
) =>
  request({
    ...config,
    url: `${basePath}${config.url}`
  })
