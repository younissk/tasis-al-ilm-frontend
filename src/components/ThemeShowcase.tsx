import { 
  Card, 
  Group, 
  Stack, 
  Text, 
  Title, 
  Button, 
  Badge, 
  Avatar, 
  Paper, 
  Container, 
  Grid, 
  Progress,
  ActionIcon,
  Alert,
  Divider
} from '@mantine/core'
import { 
  IconStar, 
  IconHeart, 
  IconBook, 
  IconUsers, 
  IconTrendingUp, 
  IconCheck,
  IconAlertCircle,
  IconInfoCircle
} from '@tabler/icons-react'

export function ThemeShowcase() {
  return (
    <Container size="xl" px="md">
      <Stack gap="xl" className="animate-fade-in">
        {/* Header */}
        <Paper p="xl" radius="lg" className="glass-effect" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(2, 132, 199, 0.1) 100%)' }}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1} className="gradient-text" mb="sm">
                Design System Showcase
              </Title>
              <Text size="lg" c="dimmed" maw={600}>
                Experience our beautiful, modern design system with carefully crafted components and animations.
              </Text>
            </div>
            <Badge size="xl" variant="light" color="primary" radius="xl" p="md">
              <Group gap="xs">
                <IconStar size={20} />
                <Text fw={600}>Premium Design</Text>
              </Group>
            </Badge>
          </Group>
        </Paper>

        {/* Color Palette */}
        <Paper withBorder radius="lg" className="glass-effect" p="xl">
          <Title order={2} className="gradient-text" mb="lg">
            Color Palette
          </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(2, 132, 199, 0.2) 100%)' }}>
                <Stack gap="sm">
                  <Text fw={600} c="primary">Primary</Text>
                  <Group gap="xs">
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-primary-5)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-primary-6)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-primary-7)' }} />
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.2) 100%)' }}>
                <Stack gap="sm">
                  <Text fw={600} c="success">Success</Text>
                  <Group gap="xs">
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-success-5)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-success-6)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-success-7)' }} />
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift" style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.2) 100%)' }}>
                <Stack gap="sm">
                  <Text fw={600} c="secondary">Secondary</Text>
                  <Group gap="xs">
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-secondary-5)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-secondary-6)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-secondary-7)' }} />
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.2) 100%)' }}>
                <Stack gap="sm">
                  <Text fw={600} c="error">Error</Text>
                  <Group gap="xs">
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-error-5)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-error-6)' }} />
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--mantine-color-error-7)' }} />
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Components Showcase */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="lg" className="glass-effect" p="xl">
              <Title order={3} className="gradient-text" mb="lg">
                Buttons & Actions
              </Title>
              <Stack gap="md">
                <Group gap="sm" wrap="wrap">
                  <Button variant="filled" color="primary" radius="xl">
                    Primary
                  </Button>
                  <Button variant="light" color="success" radius="xl">
                    Success
                  </Button>
                  <Button variant="outline" color="secondary" radius="xl">
                    Secondary
                  </Button>
                  <Button variant="gradient" gradient={{ from: 'primary', to: 'primary.7', deg: 135 }} radius="xl">
                    Gradient
                  </Button>
                </Group>
                <Group gap="sm" wrap="wrap">
                  <ActionIcon variant="filled" color="primary" size="lg" radius="xl">
                    <IconHeart size={20} />
                  </ActionIcon>
                  <ActionIcon variant="light" color="success" size="lg" radius="xl">
                    <IconCheck size={20} />
                  </ActionIcon>
                  <ActionIcon variant="outline" color="secondary" size="lg" radius="xl">
                    <IconStar size={20} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="lg" className="glass-effect" p="xl">
              <Title order={3} className="gradient-text" mb="lg">
                Badges & Status
              </Title>
              <Stack gap="md">
                <Group gap="sm" wrap="wrap">
                  <Badge color="primary" variant="filled" size="lg" radius="xl">
                    Primary
                  </Badge>
                  <Badge color="success" variant="light" size="lg" radius="xl">
                    Success
                  </Badge>
                  <Badge color="secondary" variant="outline" size="lg" radius="xl">
                    Secondary
                  </Badge>
                  <Badge color="error" variant="filled" size="lg" radius="xl">
                    Error
                  </Badge>
                </Group>
                <Group gap="sm" wrap="wrap">
                  <Badge leftSection={<IconCheck size={12} />} color="success" variant="light" size="md" radius="xl">
                    Active
                  </Badge>
                  <Badge leftSection={<IconAlertCircle size={12} />} color="error" variant="light" size="md" radius="xl">
                    Warning
                  </Badge>
                  <Badge leftSection={<IconInfoCircle size={12} />} color="primary" variant="light" size="md" radius="xl">
                    Info
                  </Badge>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Progress & Stats */}
        <Paper withBorder radius="lg" className="glass-effect" p="xl">
          <Title order={3} className="gradient-text" mb="lg">
            Progress & Statistics
              </Title>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={600}>Course Progress</Text>
                    <Text size="sm" fw={600} c="primary">85%</Text>
                  </Group>
                  <Progress value={85} color="primary" size="lg" radius="xl" />
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={600}>Learning Streak</Text>
                    <Text size="sm" fw={600} c="success">12 days</Text>
                  </Group>
                  <Progress value={80} color="success" size="lg" radius="xl" />
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={600}>Certificates</Text>
                    <Text size="sm" fw={600} c="secondary">3/5</Text>
                  </Group>
                  <Progress value={60} color="secondary" size="lg" radius="xl" />
                </Stack>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="lg" p="lg" className="hover-lift">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={600}>Community</Text>
                    <Text size="sm" fw={600} c="primary">Active</Text>
                  </Group>
                  <Progress value={100} color="primary" size="lg" radius="xl" />
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Alerts & Notifications */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Alert color="success" title="Success!" radius="lg" className="glass-effect">
              Your course has been successfully enrolled. Welcome to the learning journey!
            </Alert>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Alert color="warning" title="Reminder" radius="lg" className="glass-effect">
              Don't forget to complete your weekly assignments to maintain your progress.
            </Alert>
          </Grid.Col>
        </Grid>

        {/* User Cards */}
        <Paper withBorder radius="lg" className="glass-effect" p="xl">
          <Title order={3} className="gradient-text" mb="lg">
            User Profiles
          </Title>
          <Grid>
            {[
              { name: 'Sarah Johnson', role: 'Instructor', avatar: null, status: 'online' },
              { name: 'Michael Chen', role: 'Student', avatar: null, status: 'offline' },
              { name: 'Emily Davis', role: 'Admin', avatar: null, status: 'online' }
            ].map((user, index) => (
              <Grid.Col key={user.name} span={{ base: 12, sm: 6, md: 4 }}>
                <Card 
                  withBorder 
                  radius="lg" 
                  p="lg" 
                  className="hover-lift animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <Group gap="md">
                    <Avatar 
                      size="lg" 
                      radius="xl" 
                      color="primary"
                      style={{ border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                    <div style={{ flex: 1 }}>
                      <Text fw={600} size="sm">{user.name}</Text>
                      <Text size="xs" c="dimmed">{user.role}</Text>
                      <Badge 
                        size="xs" 
                        color={user.status === 'online' ? 'success' : 'gray'} 
                        variant="light" 
                        radius="xl"
                        mt="xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </Group>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
      </Stack>
    </Container>
  )
}
