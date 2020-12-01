import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/boss/course'
const courseRequest = buildRequestWithBaseUrl(baseUrl)

export type CourseInput = {
  id: number
  courseName: string
  brief: string
  previewFirstField: string
  previewSecondField: string
  teacherDTO: Partial<TeacherDTO>
  courseDescriptionMarkDown: string
  sortNum: number

  price: number
  discounts: number
  sales: number
  priceTag: string
  discountsTag: string
  isNew: boolean
  isNewDes: string

  courseListImg: string
  courseImgUrl: string

  status: number

  activityCourse: boolean
  activityCourseDTO: Partial<ActivityCourseDTO>

  autoOnlineTime: string
}

export type Course = CourseInput & {
  id: number
  teacherId: number
  totalCourseTime: number
  actualSales: number
  shareTitle: string
  shareDescription: string
  shareImageTitle: string
  lastOperatorId: number
  createTime: string
  updateTime: string
  isDel: boolean
  totalDuration: string | null
  seoDescription: string | null
  seoKeywords: string | null
  seoTitle: string | null
  h5Url: string | null
  tag: string | null
  brokerageRate: string | null
  joinDistribution: string | null
  lastNoticeTime: string | null
  distributionPosterImage: string | null
  distributionCopywriter: string | null
  isGray: boolean | null
  sectionDTOS: string | null
  courseUrl: string | null
  topNCourseLesson: string | null
  isBuy: boolean
  lessonUpdateCount: string | null
  compareTime: string | null
  lastLearnLessonName: string | null
  activityTime: string | null
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

export const saveOrUpdate = (data: Partial<CourseInput>) =>
  courseRequest({
    url: '/saveOrUpdateCourse',
    method: 'POST',
    data
  })
