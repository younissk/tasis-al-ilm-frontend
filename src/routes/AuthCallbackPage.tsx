import { Button, Center, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.tsx'
import {
  consumePostLoginRedirect,
  createSessionFromOAuthParams,
} from '../services/authClient.ts'

function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { completeAuthentication } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (error || errorDescription) {
      setErrorMessage(errorDescription ?? decodeURIComponent(error ?? 'Unable to complete provider sign-in.'))
      setIsProcessing(false)
      return
    }

    try {
      const session = createSessionFromOAuthParams(searchParams)
      completeAuthentication(session)
      const redirectPath = consumePostLoginRedirect() ?? '/'
      navigate(redirectPath, { replace: true })
    } catch (caughtError) {
      console.error('Failed to consume OAuth callback parameters', caughtError)
      setErrorMessage(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to complete provider authentication. Please try signing in again.',
      )
      setIsProcessing(false)
    }
  }, [completeAuthentication, navigate, searchParams])

  if (isProcessing) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    )
  }

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Paper radius="lg" shadow="md" p="xl" w={{ base: '90%', sm: 420 }}>
        <Stack align="center" gap="sm">
          <Title order={3}>Sign-in failed</Title>
          <Text c="red" ta="center">
            {errorMessage ?? 'Something went wrong while completing the sign-in with your provider.'}
          </Text>
          <Button onClick={() => navigate('/login')} variant="light">
            Back to sign-in
          </Button>
        </Stack>
      </Paper>
    </Center>
  )
}

export default AuthCallbackPage
