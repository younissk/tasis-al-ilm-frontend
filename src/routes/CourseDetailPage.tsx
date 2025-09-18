import { Alert, Anchor, Avatar, Badge, Card, Group, Image, Skeleton, Stack, Text, Title } from '@mantine/core'
import { Link, useParams } from 'react-router-dom'
import { useCourse } from '../services/useCourses.ts'
import { StrapiRequestError } from '../services/strapiClient.ts'
import type { Course } from '../services/strapiContent.ts'

const STRAPI_CONFIGURED = Boolean(import.meta.env.VITE_STRAPI_URL)

function formatDate(value?: string) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(date)
}

function CourseMeta({ course }: { course: Course }) {
  const startDate = formatDate(course.startDate)
  const endDate = formatDate(course.endDate)

  return (
    <Stack gap="sm">
      {(startDate || endDate) && (
        <Text size="sm">
          {startDate ? `Start date: ${startDate}` : 'Flexible start date'}
          {endDate ? ` • End date: ${endDate}` : ''}
        </Text>
      )}
      {course.schedule && (
        <Text size="sm">
          Schedule: <Text span fw={600}>{course.schedule}</Text>
        </Text>
      )}
      {(course.monthlyPrice !== undefined || course.semesterPrice !== undefined) && (
        <Group gap="sm">
          {course.monthlyPrice !== undefined && (
            <Badge color="grape" variant="light">
              Monthly {course.monthlyPrice}
            </Badge>
          )}
          {course.semesterPrice !== undefined && (
            <Badge color="blue" variant="light">
              Semester {course.semesterPrice}
            </Badge>
          )}
        </Group>
      )}
      {course.zoomLink && (
        <Text size="sm">
          Live sessions: <Anchor href={course.zoomLink}>{course.zoomLink}</Anchor>
        </Text>
      )}
      {course.googleDriveLink && (
        <Text size="sm">
          Shared resources: <Anchor href={course.googleDriveLink}>{course.googleDriveLink}</Anchor>
        </Text>
      )}
    </Stack>
  )
}

function CourseTeachers({ course }: { course: Course }) {
  if (course.teachers.length === 0) {
    return null
  }

  return (
    <Stack gap="sm">
      <Title order={3}>Teachers</Title>
      <Stack gap="sm">
        {course.teachers.map((teacher) => (
          <Card key={teacher.id} withBorder radius="md" padding="md">
            <Group align="flex-start" gap="md">
              <Avatar src={teacher.avatar?.url} alt={teacher.name} size={56} radius="xl">
                {teacher.name?.charAt(0) ?? '?'}
              </Avatar>
              <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between" align="flex-start">
                  <Text fw={600}>{teacher.name}</Text>
                  <Badge component={Link} to={`/teachers/${teacher.id}`} variant="light" color="teal">
                    View profile
                  </Badge>
                </Group>
                {teacher.description && (
                  <Text size="sm" c="dimmed" lineClamp={3}>
                    {teacher.description}
                  </Text>
                )}
              </Stack>
            </Group>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const query = useCourse(courseId)

  if (!STRAPI_CONFIGURED) {
    return (
      <Alert color="yellow" title="Connect Strapi to continue">
        Set <Text span fw={600}>VITE_STRAPI_URL</Text> to view course entries from Strapi.
      </Alert>
    )
  }

  if (!courseId) {
    return (
      <Alert color="red" title="Missing course identifier">
        We could not determine which course you want to view. Please navigate from the courses list.
      </Alert>
    )
  }

  if (query.isLoading) {
    return (
      <Stack>
        <Skeleton height={320} radius="md" />
        <Skeleton height={120} radius="md" />
      </Stack>
    )
  }

  if (query.isError) {
    const isForbidden = query.error instanceof StrapiRequestError && query.error.status === 403
    return (
      <Alert color={isForbidden ? 'orange' : 'red'} title={isForbidden ? 'You do not have access to this course' : 'Unable to load course'}>
        {isForbidden ? (
          <Stack gap={4}>
            <Text size="sm">
              Your Strapi role or API token lacks permission to read this course entry.
            </Text>
            <Text size="sm" c="dimmed">
              Ensure <Text span fw={600}>find</Text> and <Text span fw={600}>findOne</Text> are enabled for Courses, or that your API token can access <Text span fw={600}>/api/courses/:id</Text>.
            </Text>
          </Stack>
        ) : query.error instanceof Error ? (
          query.error.message
        ) : (
          'An unexpected error occurred while loading the course.'
        )}
      </Alert>
    )
  }

  const course = query.data

  if (!course) {
    return (
      <Alert color="blue" title="Course not available">
        This course could not be found. It may be unpublished or you might not have permissions to view it.
      </Alert>
    )
  }

  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Title order={2}>{course.name}</Title>
        {course.description && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {course.description}
          </Text>
        )}
      </Stack>

      {course.bannerImage?.url && (
        <Image
          src={course.bannerImage.url}
          alt={course.bannerImage.alternativeText ?? `${course.name} banner`}
          radius="md"
          style={{ maxHeight: 360, objectFit: 'cover' }}
        />
      )}

      <Card withBorder radius="md" padding="lg">
        <CourseMeta course={course} />
      </Card>

      {course.description && (
        <Card withBorder radius="md" padding="lg">
          <Stack gap="sm">
            <Title order={3}>About this course</Title>
            <Text size="sm" c="dimmed">
              {course.description}
            </Text>
          </Stack>
        </Card>
      )}

      <CourseTeachers course={course} />
    </Stack>
  )
}

export default CourseDetailPage
