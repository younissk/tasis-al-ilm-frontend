import { AppShell, Button, Group, NavLink, Stack, Text, Title } from '@mantine/core'
import { Outlet, NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './providers/AuthProvider.tsx'
import { useLogoutMutation } from './services/useAuthMutations.ts'

const navigation = [
  { label: 'Dashboard', to: '/' },
  { label: 'Courses', to: '/courses' },
  { label: 'Teachers', to: '/teachers' },
]

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation({
    onSuccess: () => {
      navigate('/login', { replace: true })
    },
  })

  return (
    <AppShell header={{ height: 70 }} navbar={{ width: 240, breakpoint: 'sm' }} padding="lg">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Title order={3}>Tasis Al Ilm LMS</Title>
            <Text c="dimmed" size="sm">
              Strapi-powered learning
            </Text>
          </Group>
          <Group gap="sm">
            <Stack gap={0} align="flex-end">
              <Text size="sm" fw={600}>
                {user?.username ?? 'Instructor'}
              </Text>
              {user?.email && (
                <Text size="xs" c="dimmed">
                  {user.email}
                </Text>
              )}
            </Stack>
            <Button
              size="xs"
              variant="light"
              onClick={() => logoutMutation.mutate()}
              loading={logoutMutation.isPending}
            >
              Sign out
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack gap="xs">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              component={RouterLink}
              to={item.to}
              label={item.label}
              active={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))}
            />
          ))}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}

export default App
