import { Alert, Badge, Card, Group, Skeleton, Stack, Table, Text, Title, Container, Grid, Paper, Progress, ActionIcon } from '@mantine/core'
import { IconCreditCard, IconCalendar, IconTrendingUp, IconUsers, IconCurrencyDollar, IconCheck, IconClock, IconAlertCircle } from '@tabler/icons-react'
import { useUserEnrollments } from '../services/useEnrollments.ts'
import { useAuth } from '../providers/AuthProvider.tsx'

export function BillingDashboard() {
  const { token } = useAuth()
  const { data: enrollments = [], isLoading, isError, error } = useUserEnrollments(token ?? undefined)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'inactive': return 'gray'
      case 'suspended': return 'orange'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green'
      case 'pending': return 'yellow'
      case 'overdue': return 'red'
      case 'free': return 'blue'
      default: return 'gray'
    }
  }

  if (isLoading) {
    return (
      <Stack gap="md">
        <Skeleton height={40} />
        <Skeleton height={200} />
      </Stack>
    )
  }

  if (isError) {
    return (
      <Alert color="red" title="Failed to load billing information">
        {error?.message || 'An error occurred while loading your billing information.'}
      </Alert>
    )
  }

  if (enrollments.length === 0) {
    return (
      <Alert color="blue" title="No enrollments found">
        You haven't enrolled in any courses yet. Browse our courses to get started!
      </Alert>
    )
  }

  const totalPaid = enrollments.reduce((sum, enrollment) => sum + enrollment.totalPaid, 0)
  const activeEnrollments = enrollments.filter(e => e.status === 'active')

  return (
    <Container size="xl" px="md">
      <Stack gap="xl" className="animate-fade-in">
        {/* Header */}
        <Paper p="xl" radius="lg" className="glass-effect" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)' }}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1} className="gradient-text" mb="sm">
                Billing Dashboard
              </Title>
              <Text size="lg" c="dimmed" maw={600}>
                Track your enrollments, payments, and billing information in one place.
              </Text>
            </div>
            <Badge size="xl" variant="light" color="success" radius="xl" p="md">
              <Group gap="xs">
                <IconCreditCard size={20} />
                <Text fw={600}>Active Account</Text>
              </Group>
            </Badge>
          </Group>
        </Paper>

        {/* Summary Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <Card 
              withBorder 
              radius="lg" 
              padding="xl" 
              className="hover-lift animate-fade-in-up"
              style={{ 
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(2, 132, 199, 0.1) 100%)',
                border: '1px solid rgba(14, 165, 233, 0.2)'
              }}
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    Total Enrollments
                  </Text>
                  <Text size="2.5rem" fw={800} className="gradient-text">
                    {enrollments.length}
                  </Text>
                </Stack>
                <ActionIcon size="xl" variant="light" color="primary" radius="xl">
                  <IconUsers size={24} />
                </ActionIcon>
              </Group>
              <Progress 
                value={100} 
                color="primary" 
                size="sm" 
                radius="xl"
                style={{ opacity: 0.3 }}
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <Card 
              withBorder 
              radius="lg" 
              padding="xl" 
              className="hover-lift animate-fade-in-up"
              style={{ 
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.1) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    Active Enrollments
                  </Text>
                  <Text size="2.5rem" fw={800} c="success">
                    {activeEnrollments.length}
                  </Text>
                </Stack>
                <ActionIcon size="xl" variant="light" color="success" radius="xl">
                  <IconCheck size={24} />
                </ActionIcon>
              </Group>
              <Progress 
                value={(activeEnrollments.length / Math.max(enrollments.length, 1)) * 100} 
                color="success" 
                size="sm" 
                radius="xl"
              />
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
            <Card 
              withBorder 
              radius="lg" 
              padding="xl" 
              className="hover-lift animate-fade-in-up"
              style={{ 
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.05) 0%, rgba(202, 138, 4, 0.1) 100%)',
                border: '1px solid rgba(234, 179, 8, 0.2)'
              }}
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    Total Invested
                  </Text>
                  <Text size="2.5rem" fw={800} c="secondary">
                    {formatCurrency(totalPaid)}
                  </Text>
                </Stack>
                <ActionIcon size="xl" variant="light" color="secondary" radius="xl">
                  <IconCurrencyDollar size={24} />
                </ActionIcon>
              </Group>
              <Progress 
                value={75} 
                color="secondary" 
                size="sm" 
                radius="xl"
                style={{ opacity: 0.3 }}
              />
            </Card>
          </Grid.Col>
        </Grid>

        {/* Enrollments Table */}
        <Paper withBorder radius="lg" className="glass-effect">
          <Stack gap="lg" p="xl">
            <Group justify="space-between" align="center">
              <Title order={2} className="gradient-text">
                Your Enrollments
              </Title>
              <Badge size="lg" variant="light" color="primary" radius="xl">
                {enrollments.length} Total
              </Badge>
            </Group>
            
            <div style={{ overflowX: 'auto' }}>
              <Table highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>Payment Plan</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Billing Status</Table.Th>
                    <Table.Th>Total Paid</Table.Th>
                    <Table.Th>Enrolled Date</Table.Th>
                    <Table.Th>Next Billing</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {enrollments.map((enrollment, index) => (
                    <Table.Tr 
                      key={enrollment.id}
                      className="animate-fade-in-up"
                      style={{ 
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'both'
                      }}
                    >
                      <Table.Td>
                        <Text fw={600} size="sm">{enrollment.course?.name || 'Unknown Course'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text size="sm" fw={500}>{enrollment.paymentPlan?.name || 'Unknown Plan'}</Text>
                          <Text size="xs" c="dimmed">
                            {enrollment.paymentPlan?.type === 'free' 
                              ? 'Free' 
                              : formatCurrency(enrollment.paymentPlan?.price || 0)
                            }
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={getStatusColor(enrollment.status)} 
                          variant="light"
                          size="md"
                          radius="xl"
                          leftSection={
                            enrollment.status === 'active' ? <IconCheck size={12} /> : 
                            enrollment.status === 'inactive' ? <IconClock size={12} /> :
                            <IconAlertCircle size={12} />
                          }
                        >
                          {enrollment.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          color={getBillingStatusColor(enrollment.billingStatus)} 
                          variant="light"
                          size="md"
                          radius="xl"
                        >
                          {enrollment.billingStatus}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600} c="success">{formatCurrency(enrollment.totalPaid)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconCalendar size={14} color="var(--mantine-color-gray-6)" />
                          <Text size="sm">{formatDate(enrollment.enrolledAt)}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {enrollment.nextBillingDate ? (
                          <Group gap="xs">
                            <IconTrendingUp size={14} color="var(--mantine-color-primary-6)" />
                            <Text size="sm">{formatDate(enrollment.nextBillingDate)}</Text>
                          </Group>
                        ) : (
                          <Text size="sm" c="dimmed">N/A</Text>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
