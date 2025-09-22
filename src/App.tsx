import { AppShell, Avatar, Badge, Button, Group, NavLink, Stack, Text, Title, UnstyledButton } from '@mantine/core'
import { IconBook, IconDashboard, IconLogout, IconSchool, IconUser } from '@tabler/icons-react'
import { Outlet, NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { useAuth } from './providers/AuthProvider.tsx'
import { useLogoutMutation } from './services/useAuthMutations.ts'
import { EnrollmentProvider } from './providers/EnrollmentProvider.tsx'

const navigation = [
  { label: 'Dashboard', to: '/', icon: IconDashboard },
  { label: 'Courses', to: '/courses', icon: IconBook },
  { label: 'Teachers', to: '/teachers', icon: IconSchool },
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
    <EnrollmentProvider>
      <AppShell header={{ height: 80 }} navbar={{ width: 280, breakpoint: 'sm' }} padding="lg">
        <AppShell.Header className="glass-effect">
          <Group h="100%" px="xl" justify="space-between">
            <Group gap="md">
              <div className="animate-fade-in">
                <Title order={2} className="gradient-text">
                  Tasis Al Ilm
                </Title>
                <Text c="dimmed" size="sm" fw={500}>
                  Educational Platform
                </Text>
              </div>
            </Group>
            <Group gap="md">
              <Badge variant="light" color="primary" size="lg" radius="xl">
                LMS
              </Badge>
              <Group gap="sm">
                <Stack gap={0} align="flex-end">
                  <Text size="sm" fw={600} c="dark">
                    {user?.username ?? 'Instructor'}
                  </Text>
                  {user?.email && (
                    <Text size="xs" c="dimmed">
                      {user.email}
                    </Text>
                  )}
                </Stack>
                <Avatar
                  src={user?.avatar?.url}
                  alt={user?.username ?? 'User'}
                  radius="xl"
                  size="md"
                  color="primary"
                >
                  <IconUser size={20} />
                </Avatar>
                <Button
                  size="sm"
                  variant="light"
                  color="red"
                  leftSection={<IconLogout size={16} />}
                  onClick={() => logoutMutation.mutate()}
                  loading={logoutMutation.isPending}
                  className="hover-lift"
                >
                  Sign out
                </Button>
              </Group>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="lg" className="animate-slide-in-left">
          <Stack gap="xs">
            <Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm">
              Navigation
            </Text>
            {navigation.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
              
              return (
                <NavLink
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  label={item.label}
                  leftSection={<Icon size={18} />}
                  active={isActive}
                  className="animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                />
              )
            })}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main className="animate-fade-in">
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </AppShell.Main>
      </AppShell>
    </EnrollmentProvider>
  )
}

export default App
