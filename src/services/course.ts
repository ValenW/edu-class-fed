import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/course'
const courseRequest = buildRequestWithBaseUrl(baseUrl)

export type Course = {
  id: number
  courseName: string
  brief: string
  courseDescription: string
  teacherId: number
  totalCourseTime: number
  sales: number
  actualSales: number
  price: number
  priceTag: string
  discounts: number
  discountsTag: string
  courseImgUrl: string
  shareTitle: string
  shareDescription: string
  shareImageTitle: string
  isNew: boolean
  isNewDes: boolean
  lastOperatorId: number
  createTime: string
  updateTime: string
  autoOnlineTime: string | null
  isDel: boolean
  totalDuration: string | null
  seoDescription: string | null
  seoKeywords: string | null
  seoTitle: string | null
  h5Url: string | null
  courseListImg: string
  tag: string | null
  status: number
  sortNum: number
  brokerageRate: '' | null
  joinDistribution: string | null
  lastNoticeTime: string | null
  previewFirstField: string
  previewSecondField: string
  distributionPosterImage: string | null
  distributionCopywriter: string | null
  isGray: boolean | null
  sectionDTOS: '' | null
  teacherDTO: TeacherDTO | null
  courseUrl: string | null
  topNCourseLesson: string | null
  isBuy: boolean
  lessonUpdateCount: string | null
  compareTime: string | null
  lastLearnLessonName: string | null
  courseDescriptionMarkDown: string
  activityCourse: boolean
  activityTime: string | null
  activityCourseDTO: ActivityCourseDTO | null
}
type TeacherDTO = {
  id: number
  courseId: number
  teacherName: string
  teacherHeadPicUrl: string
  position: string
  description: string
}
type ActivityCourseDTO = {
  id: number
  courseId: number
  beginTime: string
  endTime: string
  amount: number
  stock: number
}

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

export const changeState = (courseId: number, status: number) =>
  courseRequest({
    url: '/changeState',
    method: 'GET',
    params: { courseId, status }
  })
