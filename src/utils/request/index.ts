import axios from 'axios'

const request = axios.create({
  baseURL: 'http://edufront.lagou.com'
})

export * from './user'

export default request
