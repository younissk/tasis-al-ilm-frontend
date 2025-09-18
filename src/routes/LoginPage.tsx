import { Anchor, Button, Center, Divider, Loader, Paper, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider.tsx'
import { useLoginMutation } from '../services/useAuthMutations.ts'
import { buildProviderAuthUrl, storePostLoginRedirect } from '../services/authClient.ts'

function LoginPage() {
  const location = useLocation() as Location & { state?: { from?: Location } }
  const navigate = useNavigate()
  const { isAuthenticated, status } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const loginMutation = useLoginMutation()

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

    if (!identifier || !password) {
      setFormError('Please enter both your email (or username) and password.')
      return
    }

    try {
      await loginMutation.mutateAsync({ identifier, password })
      navigate(targetPath, { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.'
      setFormError(message)
    }
  }

  function handleGoogleSignIn() {
    if (!STRAPI_CONFIGURED) {
      setFormError('Set VITE_STRAPI_URL before using Google sign-in.')
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    storePostLoginRedirect(targetPath)
    const redirectUrl = `${window.location.origin}/auth/callback`
    const authUrl = buildProviderAuthUrl('google', redirectUrl, JSON.stringify({ from: targetPath }))
    window.location.assign(authUrl)
  }

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Paper component="form" onSubmit={handleSubmit} radius="lg" shadow="md" p="xl" w={{ base: '90%', sm: 420 }}>
        <Stack>
          <div>
            <Title order={2}>Welcome back</Title>
            <Text c="dimmed">Sign in with your Strapi credentials to access the LMS.</Text>
          </div>

          {!STRAPI_CONFIGURED && (
            <Text c="red" size="sm">
              Set <Text span fw={600}>VITE_STRAPI_URL</Text> (and optionally <Text span fw={600}>VITE_STRAPI_API_KEY</Text>) in your .env file to enable authentication.
            </Text>
          )}

          <TextInput
            label="Email or username"
            placeholder="you@example.com"
            value={identifier}
            onChange={(event) => setIdentifier(event.currentTarget.value)}
            required
            autoComplete="username"
            variant="filled"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            autoComplete="current-password"
            variant="filled"
          />

          {formError && (
            <Text c="red" size="sm">
              {formError}
            </Text>
          )}

          <Button type="submit" loading={loginMutation.isPending} disabled={!STRAPI_CONFIGURED}>
            Sign in
          </Button>

          <Divider label="or" labelPosition="center" my="sm" />
          <Button variant="default" onClick={handleGoogleSignIn} disabled={!STRAPI_CONFIGURED}>
            Continue with Google
          </Button>

          <Text size="xs" c="dimmed">
            Forgot your password? <Anchor href="/">Contact your administrator.</Anchor>
          </Text>
          <Text size="xs" c="dimmed">
            Need an account?{' '}
            <Anchor component={Link} to="/register" state={{ from: location.state?.from ?? { pathname: targetPath } }}>
              Create one now
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  )
}

export default LoginPage
