import { useState } from 'react'
import { Alert, Button, Card, Stack, Text, Title } from '@mantine/core'

export function PaymentPlanDebug({ courseId }: { courseId: string }) {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testPaymentPlansAPI = async () => {
    setLoading(true)
    try {
      console.log('🧪 Testing payment plans API directly...')
      
      const response = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/payment-plans?populate=course`)
      const data = await response.json()
      
      console.log('🧪 Direct API response:', data)
      
      setDebugInfo({
        status: response.status,
        data: data,
        courseId: courseId,
        courseIdAsNumber: parseInt(courseId),
        paymentPlansCount: data.data?.length || 0,
        paymentPlans: data.data?.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          is_active: plan.is_active,
          course_id: plan.course?.id,
          course_documentId: plan.course?.documentId,
          course_name: plan.course?.name
        })) || []
      })
    } catch (error) {
      console.error('🧪 Direct API error:', error)
      setDebugInfo({ error: (error as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card withBorder p="md">
      <Stack gap="md">
        <Title order={4}>Payment Plans Debug</Title>
        <Text size="sm">Course ID: {courseId}</Text>
        <Text size="sm">Course ID as Number: {parseInt(courseId)}</Text>
        
        <Button onClick={testPaymentPlansAPI} loading={loading}>
          Test Payment Plans API
        </Button>
        
        {debugInfo && (
          <Alert color="blue" title="Debug Results">
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </Alert>
        )}
      </Stack>
    </Card>
  )
}