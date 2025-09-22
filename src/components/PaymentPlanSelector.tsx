import { Alert, Badge, Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { useEnrollment } from '../providers/EnrollmentProvider.tsx'
import type { PaymentPlan } from '../services/strapiContent.ts'

type PaymentPlanSelectorProps = {
  courseId: string
  paymentPlans: PaymentPlan[]
}

export function PaymentPlanSelector({ courseId, paymentPlans }: PaymentPlanSelectorProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const { enrollInCourse, isEnrolling, enrollmentError } = useEnrollment()

  const handleEnroll = async () => {
    if (!selectedPlanId) return

    try {
      await enrollInCourse(courseId, selectedPlanId)
    } catch (error) {
      console.error('Enrollment failed:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getPlanTypeColor = (type: PaymentPlan['type']) => {
    switch (type) {
      case 'free': return 'green'
      case 'monthly': return 'blue'
      case 'semester': return 'purple'
      case 'one_time': return 'orange'
      default: return 'gray'
    }
  }

  const getPlanTypeLabel = (type: PaymentPlan['type']) => {
    switch (type) {
      case 'free': return 'Free'
      case 'monthly': return 'Monthly'
      case 'semester': return 'Semester'
      case 'one_time': return 'One-time'
      default: return type
    }
  }

  if (paymentPlans.length === 0) {
    return (
      <Alert color="yellow" title="No payment plans available">
        This course doesn't have any active payment plans. Please contact support.
      </Alert>
    )
  }

  return (
    <Stack gap="md" style={{ width: '100%' }}>
      <Title order={3}>Choose a Payment Plan</Title>
      
      {enrollmentError && (
        <Alert color="red" title="Enrollment failed">
          {enrollmentError.message}
        </Alert>
      )}

      <Stack gap="sm">
        {paymentPlans.map((plan) => (
          <Card
            key={plan.id}
            withBorder
            radius="md"
            padding="md"
            style={{
              cursor: 'pointer',
              borderColor: selectedPlanId === plan.id.toString() ? 'var(--mantine-color-blue-6)' : undefined,
              backgroundColor: selectedPlanId === plan.id.toString() ? 'var(--mantine-color-blue-0)' : undefined,
            }}
            onClick={() => setSelectedPlanId(plan.id.toString())}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap="xs" style={{ flex: 1 }}>
                <Group gap="sm">
                  <Text fw={600} size="lg">
                    {plan.name}
                  </Text>
                  <Badge color={getPlanTypeColor(plan.type)} variant="light">
                    {getPlanTypeLabel(plan.type)}
                  </Badge>
                </Group>
                
                <Text size="xl" fw={700} c={plan.type === 'free' ? 'green' : 'blue'}>
                  {plan.type === 'free' ? 'Free' : formatPrice(plan.price)}
                </Text>
                
                {plan.description && (
                  <Text size="sm" c="dimmed">
                    {plan.description}
                  </Text>
                )}
                
                {plan.type !== 'free' && (
                  <Text size="xs" c="dimmed">
                    Billing cycle: {plan.billingCycleDays} days
                  </Text>
                )}
              </Stack>
              
              <Button
                variant={selectedPlanId === plan.id.toString() ? 'filled' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedPlanId(plan.id.toString())
                }}
              >
                {selectedPlanId === plan.id.toString() ? 'Selected' : 'Select'}
              </Button>
            </Group>
          </Card>
        ))}
      </Stack>

      <Button
        size="lg"
        disabled={!selectedPlanId || isEnrolling}
        loading={isEnrolling}
        onClick={handleEnroll}
        style={{ marginTop: '1rem' }}
      >
        {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
      </Button>
    </Stack>
  )
}
