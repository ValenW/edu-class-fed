import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/course'
const courseRequest = buildRequestWithBaseUrl(baseUrl)

export type Course = {}
export type CourseQuery = {
  currentPage?: number
  pageSize?: number
  courseName?: string
  status?: string
}

export const getByPage = (data: CourseQuery) =>
  courseRequest({
    url: '/getQueryCourses',
    method: 'POST',
    data
  })

export const getById = (courseId: number | string) =>
  courseRequest({
    url: 'getCourseById',
    method: 'GET',
    params: { courseId }
  })

export const changeState = (courseId: string, status: string) =>
  courseRequest({
    url: '/changeState',
    method: 'GET',
    params: { courseId, status }
  })
