import { buildRequestWithBaseUrl } from '@/utils/request'

const baseUrl = '/front/course/session'
const sessionRequest = buildRequestWithBaseUrl(baseUrl)

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

export const getSectionAndLesson = (courseId: string | number) =>
  sessionRequest({
    url: '/getSectionAndLesson',
    params: { courseId }
  })
