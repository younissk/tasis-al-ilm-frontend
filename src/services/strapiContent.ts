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
  documentId?: string
  name: string
}

export type Course = {
  id: number
  documentId?: string
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
  url?: string | null
  name?: string | null
  alternativeText?: string | null
  width?: number | null
  height?: number | null
}

export type TeacherQualification = Record<string, unknown>

export type Teacher = {
  id: number
  documentId?: string
  name: string
  description?: string
  qualifications?: TeacherQualification[]
  avatar?: MediaAsset
  courses?: CourseSummary[]
}

export type StrapiTeacher = {
  id: number
  documentId?: string
  name?: string | null
  description?: string | null
  qualifications?: TeacherQualification[] | null
  courses?: Array<{
    id: number
    documentId?: string
    name?: string | null
  }> | null
}

export type StrapiCourse = {
  id: number
  documentId?: string
  name?: string | null
  start_date?: string | null
  end_date?: string | null
  schedule?: string | null
  description?: string | null
  zoom_link?: string | null
  monthly_price?: number | string | null
  semester_price?: number | string | null
  google_drive_link?: string | null
  banner_image?: StrapiMedia | null
  teachers?: StrapiTeacher[] | null
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
  if (!media?.url) {
    return undefined
  }

  return {
    id: media.id,
    url: toAbsoluteUrl(media.url) ?? media.url,
    name: media.name ?? undefined,
    alternativeText: media.alternativeText ?? undefined,
    width: media.width ?? undefined,
    height: media.height ?? undefined,
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

  let courses: CourseSummary[] | undefined
  if (includeCourses && teacher.courses?.length) {
    courses = teacher.courses
      .filter(
        (course): course is { id: number; documentId?: string; name?: string | null } =>
          typeof course?.id === 'number',
      )
      .map((course) => ({
        id: course.id,
        documentId: course.documentId ?? undefined,
        name: course.name ?? `Course #${course.id}`,
      }))
  }

  return {
    id: teacher.id,
    documentId: teacher.documentId ?? undefined,
    name: teacher.name ?? `Teacher #${teacher.id}`,
    description: normalizeRichText(teacher.description),
    qualifications: teacher.qualifications ?? undefined,
    avatar: undefined,
    courses,
  }
}

export function transformCourse(course: StrapiCourse): Course {
  const bannerImage = transformMedia(course.banner_image ?? undefined)
  const teachers = course.teachers?.map((teacher) => transformTeacher(teacher)) ?? []

  return {
    id: course.id,
    documentId: course.documentId ?? undefined,
    name: course.name ?? `Course #${course.id}`,
    startDate: course.start_date ?? undefined,
    endDate: course.end_date ?? undefined,
    schedule: course.schedule ?? undefined,
    description: normalizeRichText(course.description),
    bannerImage,
    teachers,
    zoomLink: course.zoom_link ?? undefined,
    monthlyPrice: parseNumber(course.monthly_price),
    semesterPrice: parseNumber(course.semester_price),
    googleDriveLink: course.google_drive_link ?? undefined,
  }
}
