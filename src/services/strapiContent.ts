import { getStrapiBaseUrl } from './strapiClient.ts'

export type MediaAsset = {
  id: number
  url: string
  name?: string
  alternativeText?: string
  width?: number
  height?: number
}

export type CourseSummary = {
  id: number
  name: string
}

export type Course = {
  id: number
  name: string
  startDate?: string
  endDate?: string
  schedule?: string
  description?: string
  bannerImage?: MediaAsset
  teachers: Teacher[]
  zoomLink?: string
  monthlyPrice?: number
  semesterPrice?: number
  googleDriveLink?: string
}

export type StrapiMedia = {
  id: number
  attributes: {
    url?: string | null
    name?: string | null
    alternativeText?: string | null
    width?: number | null
    height?: number | null
  }
}

export type TeacherQualification = Record<string, unknown>

export type Teacher = {
  id: number
  name: string
  description?: string
  qualifications?: TeacherQualification[]
  avatar?: MediaAsset
  courses?: CourseSummary[]
}

export type StrapiTeacher = {
  id: number
  attributes: {
    name?: string | null
    description?: string | null
    qualifications?: TeacherQualification[] | null
    courses?: {
      data: Array<{
        id: number
        attributes?: {
          name?: string | null
        }
      }>
    } | null
  }
}

export type StrapiCourse = {
  id: number
  attributes: {
    name?: string | null
    start_date?: string | null
    end_date?: string | null
    schedule?: string | null
    description?: string | null
    zoom_link?: string | null
    monthly_price?: number | string | null
    semester_price?: number | string | null
    google_drive_link?: string | null
    banner_image?: {
      data?: StrapiMedia | null
    } | null
    teachers?: {
      data: StrapiTeacher[]
    } | null
  }
}

function toAbsoluteUrl(url?: string | null) {
  if (!url) {
    return undefined
  }

  try {
    const baseUrl = getStrapiBaseUrl()
    return new URL(url, baseUrl).toString()
  } catch (error) {
    console.warn('Failed to construct absolute Strapi media URL', error)
    return url
  }
}

function transformMedia(media?: StrapiMedia | null): MediaAsset | undefined {
  if (!media?.attributes?.url) {
    return undefined
  }

  return {
    id: media.id,
    url: toAbsoluteUrl(media.attributes.url) ?? media.attributes.url,
    name: media.attributes.name ?? undefined,
    alternativeText: media.attributes.alternativeText ?? undefined,
    width: media.attributes.width ?? undefined,
    height: media.attributes.height ?? undefined,
  }
}

function parseNumber(value?: number | string | null) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function normalizeRichText(value?: string | null) {
  if (!value) {
    return undefined
  }

  const withoutTags = value.replace(/<[^>]*>/g, '')
  const trimmed = withoutTags.replace(/\s+/g, ' ').trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function transformTeacher(teacher: StrapiTeacher, options: { includeCourses?: boolean } = {}): Teacher {
  const { includeCourses = false } = options

  const attributes = teacher.attributes ?? {}

  let courses: CourseSummary[] | undefined
  if (includeCourses && attributes.courses?.data?.length) {
    courses = attributes.courses.data
      .filter((course) => course && typeof course.id === 'number')
      .map((course) => ({
        id: course.id,
        name: course.attributes?.name ?? `Course #${course.id}`,
      }))
  }

  return {
    id: teacher.id,
    name: attributes.name ?? `Teacher #${teacher.id}`,
    description: normalizeRichText(attributes.description),
    qualifications: attributes.qualifications ?? undefined,
    avatar: undefined,
    courses,
  }
}

export function transformCourse(course: StrapiCourse): Course {
  const attributes = course.attributes ?? {}

  const bannerImage = transformMedia(attributes.banner_image?.data ?? undefined)
  const teachers = attributes.teachers?.data?.map((teacher) => transformTeacher(teacher)) ?? []

  return {
    id: course.id,
    name: attributes.name ?? `Course #${course.id}`,
    startDate: attributes.start_date ?? undefined,
    endDate: attributes.end_date ?? undefined,
    schedule: attributes.schedule ?? undefined,
    description: normalizeRichText(attributes.description),
    bannerImage,
    teachers,
    zoomLink: attributes.zoom_link ?? undefined,
    monthlyPrice: parseNumber(attributes.monthly_price),
    semesterPrice: parseNumber(attributes.semester_price),
    googleDriveLink: attributes.google_drive_link ?? undefined,
  }
}
