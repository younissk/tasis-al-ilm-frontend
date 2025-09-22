import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { strapiFetch } from './strapiClient.ts'
import { transformEnrollment, transformPaymentPlan, type Enrollment, type PaymentPlan, type StrapiEnrollment, type StrapiPaymentPlan } from './strapiContent.ts'

const HAS_STRAPI_API_KEY = Boolean(import.meta.env.VITE_STRAPI_API_KEY)

function buildHeaders(token?: string) {
  if (!token || HAS_STRAPI_API_KEY) {
    return undefined
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

type StrapiEnrollmentResponse = {
  data: StrapiEnrollment[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

type StrapiPaymentPlanResponse = {
  data: StrapiPaymentPlan[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}


async function fetchUserEnrollments(token?: string): Promise<Enrollment[]> {
  const headers = buildHeaders(token)
  const response = await strapiFetch<StrapiEnrollmentResponse>(
    'api/enrollments?populate=course&populate=payment_plan&populate=payments',
    { headers }
  )

  return response.data.map((enrollment) => transformEnrollment(enrollment))
}

async function fetchCoursePaymentPlans(courseId: string, token?: string): Promise<PaymentPlan[]> {
  const headers = buildHeaders(token)
  console.log('🔍 Fetching payment plans for course:', courseId, 'with token:', token ? 'Present' : 'None')
  
  try {
    // First try without filters to see if the basic API works
    const response = await strapiFetch<StrapiPaymentPlanResponse>(
      `api/payment-plans?populate=course`,
      { headers }
    )

    console.log('📦 Raw payment plans response:', response)
    console.log('📊 Total payment plans found:', response.data.length)

    // Log each payment plan with its course information
    response.data.forEach((plan, index) => {
      console.log(`📋 Payment Plan ${index + 1}:`, {
        id: plan.id,
        name: plan.name,
        is_active: plan.is_active,
        course_id: plan.course?.id,
        course_documentId: plan.course?.documentId,
        course_name: plan.course?.name
      })
    })

    // Filter on the frontend for now - using correct Strapi field names
    const filteredPlans = response.data.filter(plan => {
      const courseIdMatch = plan.course?.id === parseInt(courseId)
      const isActive = plan.is_active === true
      
      console.log(`🔍 Filtering plan "${plan.name}":`, {
        courseIdFromPlan: plan.course?.id,
        courseIdFromURL: parseInt(courseId),
        courseIdMatch,
        isActive,
        willInclude: courseIdMatch && isActive
      })
      
      return courseIdMatch && isActive
    })

    console.log('✅ Filtered payment plans:', filteredPlans)
    console.log('📈 Final count:', filteredPlans.length)

    return filteredPlans.map((plan) => transformPaymentPlan(plan))
  } catch (error) {
    console.error('❌ Error fetching payment plans:', error)
    throw error
  }
}

async function checkEnrollment(courseId: string, token?: string): Promise<{ isEnrolled: boolean; enrollment: Enrollment | null }> {
  // If no token, user is definitely not enrolled
  if (!token) {
    return {
      isEnrolled: false,
      enrollment: null
    }
  }

  const headers = buildHeaders(token)
  console.log('🔍 Checking enrollment for course:', courseId, 'with token:', token ? 'Present' : 'None')
  
  try {
    // Try without filters first
    const response = await strapiFetch<StrapiEnrollmentResponse>(
      `api/enrollments?populate=course&populate=payment_plan`,
      { headers }
    )

    console.log('📦 Enrollment check response:', response)

    // Filter on the frontend - using correct Strapi field names
    const filteredEnrollments = response.data.filter(enrollment => 
      enrollment.course?.id === parseInt(courseId) && 
      enrollment.status === 'active'
    )

    console.log('✅ Filtered enrollments:', filteredEnrollments)

    const enrollment = filteredEnrollments.length > 0 ? transformEnrollment(filteredEnrollments[0]) : null
    
    return {
      isEnrolled: filteredEnrollments.length > 0,
      enrollment
    }
  } catch (error) {
    console.error('❌ Error checking enrollment:', error)
    // If there's an error, assume not enrolled
    return {
      isEnrolled: false,
      enrollment: null
    }
  }
}

async function enrollInCourse(courseId: string, paymentPlanId: string, token?: string): Promise<Enrollment> {
  const headers = buildHeaders(token)
  const response = await strapiFetch<{ data: StrapiEnrollment }>(
    'api/enrollments',
    {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          course: courseId,
          payment_plan: paymentPlanId,
          enrolled_at: new Date().toISOString(),
          status: 'active',
          billing_status: 'pending',
          total_paid: 0
        }
      })
    }
  )

  return transformEnrollment(response.data)
}

export function useUserEnrollments(token?: string) {
  return useQuery({
    queryKey: ['enrollments', 'user'],
    queryFn: () => fetchUserEnrollments(token),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useCoursePaymentPlans(courseId: string, token?: string) {
  return useQuery({
    queryKey: ['payment-plans', 'course', courseId],
    queryFn: () => fetchCoursePaymentPlans(courseId, token),
    enabled: Boolean(courseId), // Only require courseId, not token - payment plans should be publicly visible
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3, // Retry failed requests
    retryDelay: 1000, // Wait 1 second between retries
  })
}

export function useEnrollmentCheck(courseId: string, token?: string) {
  return useQuery({
    queryKey: ['enrollment-check', courseId, token],
    queryFn: () => checkEnrollment(courseId, token),
    enabled: Boolean(courseId), // Only require courseId, token is optional
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3, // Retry failed requests
    retryDelay: 1000, // Wait 1 second between retries
  })
}

export function useEnrollMutation(token?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, paymentPlanId }: { courseId: string; paymentPlanId: string }) =>
      enrollInCourse(courseId, paymentPlanId, token),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment-check'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })
}