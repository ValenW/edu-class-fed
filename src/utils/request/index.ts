import store from '@/store'
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://edufront.lagou.com'
})

request.interceptors.request.use(config => {
  if (store.state.user && store.state.user.access_token) {
    config.headers.Authorization = store.state.user.access_token
  }

  return config
})

export default request
