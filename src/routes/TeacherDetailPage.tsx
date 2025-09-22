import { Alert, Avatar, Badge, Card, Group, Skeleton, Stack, Text, Title } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'
import { useTeacher } from '../services/useTeachers.ts'
import { StrapiRequestError } from '../services/strapiClient.ts'

const STRAPI_CONFIGURED = Boolean(import.meta.env.VITE_STRAPI_URL)

function TeacherDetailPage() {
  const { teacherId } = useParams<{ teacherId: string }>()
  const query = useTeacher(teacherId)

  if (!STRAPI_CONFIGURED) {
    return (
      <Alert color="yellow" title="Connect Strapi to continue">
        Set <Text span fw={600}>VITE_STRAPI_URL</Text> to view teacher profiles from Strapi.
      </Alert>
    )
  }

  if (!teacherId) {
    return (
      <Alert color="red" title="Missing teacher identifier">
        We could not determine which teacher you want to view. Please navigate from the teachers list.
      </Alert>
    )
  }

  if (query.isLoading) {
    return (
      <Stack>
        <Skeleton height={240} radius="md" />
        <Skeleton height={160} radius="md" />
      </Stack>
    )
  }

  if (query.isError) {
    const isForbidden = query.error instanceof StrapiRequestError && query.error.status === 403
    return (
      <Alert color={isForbidden ? 'orange' : 'red'} title={isForbidden ? 'You do not have access to this teacher' : 'Unable to load teacher'}>
        {isForbidden ? (
          <Stack gap={4}>
            <Text size="sm">
              Your Strapi role or API token lacks permission to read this teacher entry.
            </Text>
            <Text size="sm" c="dimmed">
              Grant <Text span fw={600}>find</Text> and <Text span fw={600}>findOne</Text> for Teachers, or ensure your API token can access <Text span fw={600}>/api/teachers/:id</Text>.
            </Text>
          </Stack>
        ) : query.error instanceof Error ? (
          query.error.message
        ) : (
          'An unexpected error occurred while loading the teacher.'
        )}
      </Alert>
    )
  }

  const teacher = query.data

  if (!teacher) {
    return (
      <Alert color="blue" title="Teacher not available">
        This teacher profile could not be found. It may be unpublished or you might not have permissions to view it.
      </Alert>
    )
  }

  return (
    <Stack gap="xl">
      <Card withBorder radius="md" padding="lg">
        <Group align="flex-start" gap="lg">
          <Avatar radius={120} size={120}>
            {teacher.name?.charAt(0) ?? '?'}
          </Avatar>
          <Stack gap={4} style={{ flex: 1 }}>
            <Title order={2}>{teacher.name}</Title>
            {teacher.description && (
              <Text size="sm" c="dimmed">
                {teacher.description}
              </Text>
            )}
          </Stack>
        </Group>
      </Card>

      {teacher.qualifications?.length ? (
        <Card withBorder radius="md" padding="lg">
          <Stack gap="sm">
            <Title order={3}>Qualifications</Title>
            <Stack gap="xs">
              {teacher.qualifications.map((item, index) => (
                <Text key={index} size="sm" c="dimmed">
                  {typeof item === 'object' && item !== null
                    ? Object.values(item)
                        .filter(Boolean)
                        .join(' • ')
                    : String(item)}
                </Text>
              ))}
            </Stack>
          </Stack>
        </Card>
      ) : null}

      {teacher.courses?.length ? (
        <Card withBorder radius="md" padding="lg">
          <Stack gap="sm">
            <Title order={3}>Courses</Title>
            <Stack gap="xs">
              {teacher.courses.map((course) => (
                <Badge
                  key={course.id}
                  component={Link}
                  to={`/courses/${course.documentId ?? course.id}`}
                  variant="light"
                  color="teal"
                >
                  {course.name}
                </Badge>
              ))}
            </Stack>
          </Stack>
        </Card>
      ) : null}
    </Stack>
  )
}

export default TeacherDetailPage
