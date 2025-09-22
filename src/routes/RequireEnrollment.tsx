import { Alert, Center, Loader, Stack, Text, Title } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useCoursePaymentPlans, useEnrollmentCheck } from '../services/useEnrollments.ts'
import { PaymentPlanSelector } from '../components/PaymentPlanSelector.tsx'
import { PaymentPlanDebug } from '../components/PaymentPlanDebug.tsx'
import { useAuth } from '../providers/AuthProvider.tsx'

type PropsWithChildren = {
  children: React.ReactNode
}

function RequireEnrollment({ children }: PropsWithChildren) {
  const { courseId } = useParams<{ courseId: string }>()
  const { token } = useAuth()
  const { 
    data: enrollmentCheck, 
    isLoading: isLoadingCheck, 
    error: enrollmentError 
  } = useEnrollmentCheck(courseId || '', token ?? undefined)
  const { 
    data: paymentPlans = [], 
    isLoading: isLoadingPlans, 
    error: paymentPlansError 
  } = useCoursePaymentPlans(courseId || '', token ?? undefined)

  // Debug logging
  console.log('RequireEnrollment Debug:', {
    courseId,
    token: token ? 'Present' : 'Missing',
    enrollmentCheck,
    enrollmentError,
    paymentPlans,
    paymentPlansError,
    isLoadingCheck,
    isLoadingPlans
  })

  if (!courseId) {
    return (
      <Alert color="red" title="Missing course identifier">
        We could not determine which course you want to access.
      </Alert>
    )
  }

  if (isLoadingCheck || isLoadingPlans) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text size="sm" c="dimmed">Loading enrollment information...</Text>
        </Stack>
      </Center>
    )
  }

  // Show error if there are API errors
  if (enrollmentError || paymentPlansError) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Stack gap="md">
          <Alert color="red" title="Error loading enrollment data">
            <Text size="sm">
              {enrollmentError ? `Enrollment check error: ${enrollmentError.message}` : ''}
              {paymentPlansError ? `Payment plans error: ${paymentPlansError.message}` : ''}
            </Text>
          </Alert>
          <PaymentPlanDebug courseId={courseId} />
        </Stack>
      </Center>
    )
  }

  if (enrollmentCheck?.isEnrolled) {
    return <>{children}</>
  }

  // User is not enrolled, show enrollment options
  return (
    <Center style={{ minHeight: '50vh' }}>
      <Stack align="center" gap="lg" style={{ maxWidth: 800, textAlign: 'center' }}>
        <Title order={2}>Enrollment Required</Title>
        <Text c="dimmed">
          You need to enroll in this course to access its content. Please choose a payment plan below.
        </Text>
        
        {paymentPlans.length > 0 ? (
          <PaymentPlanSelector courseId={courseId} paymentPlans={paymentPlans} />
        ) : (
          <Stack gap="md" align="center">
            <Alert color="yellow" title="No payment plans available">
              <Text size="sm">
                This course doesn't have any active payment plans. Please contact support.
              </Text>
              <Text size="xs" c="dimmed" mt="xs">
                Debug: Found {paymentPlans.length} payment plans for course {courseId}
              </Text>
            </Alert>
            <PaymentPlanDebug courseId={courseId} />
          </Stack>
        )}
      </Stack>
    </Center>
  )
}

export default RequireEnrollment