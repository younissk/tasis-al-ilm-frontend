import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useUserEnrollments, useEnrollMutation } from '../services/useEnrollments.ts'
import { useAuth } from './AuthProvider.tsx'
import type { Enrollment } from '../services/strapiContent.ts'

type EnrollmentContextValue = {
  enrollments: Enrollment[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEnrolledInCourse: (courseId: string) => boolean
  getEnrollmentForCourse: (courseId: string) => Enrollment | null
  enrollInCourse: (courseId: string, paymentPlanId: string) => Promise<Enrollment>
  isEnrolling: boolean
  enrollmentError: Error | null
}

const EnrollmentContext = createContext<EnrollmentContextValue | undefined>(undefined)

type PropsWithChildren = {
  children: ReactNode
}

export function EnrollmentProvider({ children }: PropsWithChildren) {
  const { token, isAuthenticated } = useAuth()
  const { data: enrollments = [], isLoading, isError, error } = useUserEnrollments(token ?? undefined)
  const enrollMutation = useEnrollMutation(token ?? undefined)

  const contextValue = useMemo<EnrollmentContextValue>(() => {
    const isEnrolledInCourse = (courseId: string): boolean => {
      if (!isAuthenticated) return false
      return enrollments.some(
        (enrollment) => 
          enrollment.course?.id.toString() === courseId && 
          enrollment.status === 'active'
      )
    }

    const getEnrollmentForCourse = (courseId: string): Enrollment | null => {
      if (!isAuthenticated) return null
      return enrollments.find(
        (enrollment) => 
          enrollment.course?.id.toString() === courseId && 
          enrollment.status === 'active'
      ) ?? null
    }

    const enrollInCourse = async (courseId: string, paymentPlanId: string): Promise<Enrollment> => {
      return enrollMutation.mutateAsync({ courseId, paymentPlanId })
    }

    return {
      enrollments,
      isLoading,
      isError,
      error: error as Error | null,
      isEnrolledInCourse,
      getEnrollmentForCourse,
      enrollInCourse,
      isEnrolling: enrollMutation.isPending,
      enrollmentError: enrollMutation.error as Error | null,
    }
  }, [enrollments, isLoading, isError, error, isAuthenticated, enrollMutation])

  return (
    <EnrollmentContext.Provider value={contextValue}>
      {children}
    </EnrollmentContext.Provider>
  )
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext)
  if (context === undefined) {
    throw new Error('useEnrollment must be used within an EnrollmentProvider')
  }
  return context
}
