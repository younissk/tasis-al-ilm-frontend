import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../providers/AuthProvider.tsx'
import { MissingStrapiConfigError, StrapiRequestError, strapiFetch } from './strapiClient.ts'
import { transformTeacher } from './strapiContent.ts'
import type { StrapiTeacher, Teacher } from './strapiContent.ts'

type StrapiTeachersResponse = {
  data: StrapiTeacher[]
}

type StrapiTeacherResponse = {
  data: StrapiTeacher | null
}

const STRAPI_CONFIGURED = Boolean(import.meta.env.VITE_STRAPI_URL)
const HAS_STRAPI_API_KEY = Boolean(import.meta.env.VITE_STRAPI_API_KEY)

function buildHeaders(token?: string) {
  if (!token || HAS_STRAPI_API_KEY) {
    return undefined
  }

  return {
    Authorization: `Bearer ${token}`,
  }
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

async function fetchTeachers(token?: string): Promise<Teacher[]> {
  const headers = buildHeaders(token)
  const response = await strapiFetch<StrapiTeachersResponse>('api/teachers?populate=courses&sort=name', {
    headers,
  })

  return response.data.map((teacher) => transformTeacher(teacher))
}

async function fetchTeacherById(teacherId: string, token?: string): Promise<Teacher> {
  const headers = buildHeaders(token)
  const response = await strapiFetch<StrapiTeacherResponse>(
    `api/teachers/${teacherId}?populate=courses`,
    {
      headers,
    },
  )

  if (!response.data) {
    throw new Error('Teacher not found. They may have been removed or you may not have access to the profile.')
  }

  return transformTeacher(response.data, { includeCourses: true })
}

export function useTeachers() {
  const { token } = useAuth()

  return useQuery<Teacher[]>({
    queryKey: ['teachers', token],
    queryFn: () => fetchTeachers(token ?? undefined),
    enabled: STRAPI_CONFIGURED,
    staleTime: 1000 * 60,
    retry: createRetryHandler(),
  })
}

export function useTeacher(teacherId?: string) {
  const { token } = useAuth()

  return useQuery<Teacher>({
    queryKey: ['teacher', teacherId, token],
    queryFn: () => fetchTeacherById(teacherId!, token ?? undefined),
    enabled: STRAPI_CONFIGURED && Boolean(teacherId),
    staleTime: 1000 * 30,
    retry: createRetryHandler(),
  })
}
