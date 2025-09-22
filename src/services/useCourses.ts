import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../providers/AuthProvider.tsx'
import { MissingStrapiConfigError, StrapiRequestError, strapiFetch } from './strapiClient.ts'
import { transformCourse } from './strapiContent.ts'
import type { Course, StrapiCourse } from './strapiContent.ts'

const HAS_STRAPI_API_KEY = Boolean(import.meta.env.VITE_STRAPI_API_KEY)

type StrapiCoursesResponse = {
  data: StrapiCourse[]
}

type StrapiCourseResponse = {
  data: StrapiCourse | null
}

const STRAPI_CONFIGURED = Boolean(import.meta.env.VITE_STRAPI_URL)

function buildHeaders(token?: string) {
  if (!token || HAS_STRAPI_API_KEY) {
    return undefined
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function fetchCourses(token?: string): Promise<Course[]> {
  const headers = buildHeaders(token)
  const response = await strapiFetch<StrapiCoursesResponse>('api/courses?populate=banner_image&populate=teachers&sort=name', {
    headers,
  })

  return response.data.map((course) => transformCourse(course))
}

async function fetchCourseById(courseId: string, token?: string): Promise<Course> {
  const headers = buildHeaders(token)
  const response = await strapiFetch<StrapiCourseResponse>(
    `api/courses/${courseId}?populate=banner_image&populate=teachers`,
    {
      headers,
    },
  )

  if (!response.data) {
    throw new Error('Course not found. It may have been removed or you may not have access to it.')
  }

  return transformCourse(response.data)
}

function createRetryHandler() {
  return (failureCount: number, error: unknown) => {
    if (error instanceof MissingStrapiConfigError) {
      return false
    }

    if (error instanceof StrapiRequestError && [401, 403].includes(error.status)) {
      return false
    }

    return failureCount < 2
  }
}

export function useCourses() {
  const { token } = useAuth()

  return useQuery<Course[]>({
    queryKey: ['courses', token],
    queryFn: () => fetchCourses(token ?? undefined),
    enabled: STRAPI_CONFIGURED,
    staleTime: 1000 * 60,
    retry: createRetryHandler(),
  })
}

export function useCourse(courseId?: string) {
  const { token } = useAuth()

  return useQuery<Course>({
    queryKey: ['course', courseId, token],
    queryFn: () => fetchCourseById(courseId!, token ?? undefined),
    enabled: STRAPI_CONFIGURED && Boolean(courseId),
    staleTime: 1000 * 30,
    retry: createRetryHandler(),
  })
}
