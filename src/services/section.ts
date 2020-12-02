import { buildRequestWithBaseUrl } from '@/utils/request'

const sectionFrontUrl = '/front/course/session'
const sectionFrontRequest = buildRequestWithBaseUrl(sectionFrontUrl)

const sectionUrl = '/boss/course/section'
const sectionRequest = buildRequestWithBaseUrl(sectionUrl)

const lessonUrl = '/boss/course/lesson'
const lessonRequest = buildRequestWithBaseUrl(lessonUrl)

export type CourseContent = {
  courseName: string
  coverImage: string
  hasBuy: boolean
  courseSectionList: Section[]
}

export type Section = {
  id: number
  courseId: number
  status: number
  description: string
  sectionName: string
  courseLessons: Lesson[]
}

export type Lesson = {
  id: number
  courseId: number
  sectionId: number
  theme: string

  status: number
  duration: string

  canPlay: boolean
  hasLearned: boolean
  hasVideo: boolean

  // TODO
  textContent: string | null
  textUrl: string | null
  videoMediaDTO: string | null
}

export type SectionForm = Partial<{
  id: number
  courseId: number
  courseName: string
  sectionName: string
  description: string
  orderNum: number
  status: number
}>

export type LessonFrom = Partial<{
  id: number
  courseId: number
  sectionId: number
  theme: string
  duration: number
  isFree: boolean
  orderNum: number
  status: number
}>

export const getSectionAndLesson = (courseId: string | number) =>
  sectionFrontRequest({
    url: '/getSectionAndLesson',
    params: { courseId }
  })

export const updateSection = (data: SectionForm) =>
  sectionRequest({
    url: '/saveOrUpdateSection',
    method: 'POST',
    data
  })

export const updateLesson = (data: LessonFrom) =>
  lessonRequest({
    url: '/saveOrUpdate',
    method: 'POST',
    data
  })

export const getLessonById = (lessonId: string | number) =>
  lessonRequest({
    url: '/getById',
    params: { lessonId }
  })
