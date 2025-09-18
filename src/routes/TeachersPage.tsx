import { Alert, Avatar, Button, Card, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { useTeachers } from '../services/useTeachers.ts'
import { StrapiRequestError } from '../services/strapiClient.ts'

const STRAPI_CONFIGURED = Boolean(import.meta.env.VITE_STRAPI_URL)

function TeachersPage() {
  const { data, isLoading, isError, error, isFetching } = useTeachers()

  if (!STRAPI_CONFIGURED) {
    return (
      <Alert color="yellow" title="Connect Strapi to continue">
        Set <Text span fw={600}>VITE_STRAPI_URL</Text> to fetch teachers from your Strapi workspace.
      </Alert>
    )
  }

  if (isError) {
    const isForbidden = error instanceof StrapiRequestError && error.status === 403
    return (
      <Alert color={isForbidden ? 'orange' : 'red'} title={isForbidden ? 'You do not have access to teachers' : 'Unable to load teachers'}>
        {isForbidden ? (
          <Stack gap={4}>
            <Text size="sm">
              Your Strapi role or API token cannot read the Teachers collection.
            </Text>
            <Text size="sm" c="dimmed">
              Grant <Text span fw={600}>find</Text> and <Text span fw={600}>findOne</Text> permissions for Teachers (Settings → Users & Permissions → Roles) or update your API token so it can access <Text span fw={600}>/api/teachers</Text>.
            </Text>
          </Stack>
        ) : error instanceof Error ? (
          error.message
        ) : (
          'An unexpected error occurred while loading teachers.'
        )}
      </Alert>
    )
  }

  return (
    <Stack>
      <Stack gap={4}>
        <Title order={2}>Teachers</Title>
        <Text c="dimmed">Meet the instructors guiding your courses.</Text>
      </Stack>

      {isLoading || isFetching ? (
        <Stack>
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </Stack>
      ) : data?.length ? (
        data.map((teacher) => (
          <Card key={teacher.id} withBorder radius="md" padding="lg">
            <Group align="flex-start" gap="md">
              <Avatar src={teacher.avatar?.url} alt={teacher.name} size={64} radius="xl">
                {teacher.name?.charAt(0) ?? '?'}
              </Avatar>
              <Stack gap={4} style={{ flex: 1 }}>
                <Text fw={600}>{teacher.name}</Text>
                {teacher.description && (
                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {teacher.description}
                  </Text>
                )}
              </Stack>
              <Button component={Link} to={`/teachers/${teacher.id}`} variant="light">
                View profile
              </Button>
            </Group>
          </Card>
        ))
      ) : (
        <Alert color="blue" title="No teachers yet">
          Create teacher entries in Strapi to see them listed here.
        </Alert>
      )}
    </Stack>
  )
}

export default TeachersPage
