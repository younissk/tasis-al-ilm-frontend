import { Anchor, Button, Center, Loader, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.tsx'
import { useRegisterMutation } from '../services/useAuthMutations.ts'

function RegisterPage() {
  const location = useLocation() as Location & { state?: { from?: Location } }
  const navigate = useNavigate()
  const { isAuthenticated, status } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const registerMutation = useRegisterMutation()

  const STRAPI_CONFIGURED = Boolean(import.meta.env.VITE_STRAPI_URL)

  if (status === 'loading') {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const targetPath = location.state?.from?.pathname ?? '/'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!username || !email || !password) {
      setFormError('Please complete all required fields.')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    try {
      await registerMutation.mutateAsync({ username, email, password })
      navigate(targetPath, { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create your account. Please try again.'
      setFormError(message)
    }
  }

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Paper component="form" onSubmit={handleSubmit} radius="lg" shadow="md" p="xl" w={{ base: '90%', sm: 420 }}>
        <Stack>
          <div>
            <Title order={2}>Create an account</Title>
            <Text c="dimmed">Set up your instructor access for the LMS.</Text>
          </div>

          {!STRAPI_CONFIGURED && (
            <Text c="red" size="sm">
              Set <Text span fw={600}>VITE_STRAPI_URL</Text> before creating accounts.
            </Text>
          )}

          <TextInput
            label="Name"
            placeholder="Jane Doe"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
            required
            autoComplete="name"
            variant="filled"
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            autoComplete="email"
            variant="filled"
            type="email"
          />
          <PasswordInput
            label="Password"
            placeholder="Choose a secure password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            autoComplete="new-password"
            variant="filled"
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
            required
            autoComplete="new-password"
            variant="filled"
          />

          {formError && (
            <Text c="red" size="sm">
              {formError}
            </Text>
          )}

          <Button type="submit" loading={registerMutation.isPending} disabled={!STRAPI_CONFIGURED}>
            Create account
          </Button>

          <Text size="xs" c="dimmed">
            Already have an account?{' '}
            <Anchor component={Link} to="/login" state={{ from: location.state?.from ?? { pathname: targetPath } }}>
              Sign in instead
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  )
}

export default RegisterPage
