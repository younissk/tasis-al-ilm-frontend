import { Alert, Avatar, Badge, Button, Card, Group, Image, Skeleton, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'
import { useCourses } from '../services/useCourses.ts'
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

  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

function CourseCard({ course }: { course: Course }) {
  const startDate = formatDate(course.startDate)
  const endDate = formatDate(course.endDate)

  return (
    <Card key={course.id} withBorder radius="md" shadow="xs" padding="lg">
      {course.bannerImage?.url && (
        <Card.Section>
          <Image
            src={course.bannerImage.url}
            alt={course.bannerImage.alternativeText ?? `${course.name} banner`}
            height={180}
            style={{ objectFit: 'cover' }}
          />
        </Card.Section>
      )}

      <Stack gap="sm" mt={course.bannerImage?.url ? 'md' : 0}>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={4}>{course.name}</Title>
            {course.schedule && (
              <Text size="sm" c="dimmed">
                {course.schedule}
              </Text>
            )}
          </div>
          <Stack gap={4} align="flex-end">
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
          </Stack>
        </Group>

        {(startDate || endDate) && (
          <Text size="sm">
            {startDate ? `Starts ${startDate}` : 'Flexible start'}
            {endDate ? ` • Ends ${endDate}` : ''}
          </Text>
        )}

        {course.description && (
          <Text size="sm" c="dimmed" lineClamp={3}>
            {course.description}
          </Text>
        )}

        {course.teachers.length > 0 && (
          <Group gap="xs">
            {course.teachers.map((teacher) => (
              <Badge
                key={teacher.id}
                component={Link}
                to={`/teachers/${teacher.id}`}
                variant="outline"
                color="teal"
              >
                {teacher.name}
              </Badge>
            ))}
          </Group>
        )}

        <Group justify="space-between">
          <Group gap="sm">
            {course.teachers.slice(0, 3).map((teacher) => (
              <Avatar key={teacher.id} src={teacher.avatar?.url} alt={teacher.name} radius="xl" size="md">
                {teacher.name?.charAt(0) ?? '?'}
              </Avatar>
            ))}
          </Group>
          <Button component={Link} to={`/courses/${course.id}`} variant="light">
            View details
          </Button>
        </Group>
      </Stack>
    </Card>
  )
}

function CoursesPage() {
  const { data, isLoading, isError, error, isFetching } = useCourses()

  if (!STRAPI_CONFIGURED) {
    return (
      <Alert color="yellow" title="Connect Strapi to continue">
        Set <Text span fw={600}>VITE_STRAPI_URL</Text> and <Text span fw={600}>VITE_STRAPI_API_KEY</Text> in your .env file to fetch
        courses. We will request data from&nbsp;
        <Text span fw={600}>/api/courses</Text> once the backend is reachable.
      </Alert>
    )
  }

  if (isError) {
    const isForbidden = error instanceof StrapiRequestError && error.status === 403
    return (
      <Alert color={isForbidden ? 'orange' : 'red'} title={isForbidden ? 'You do not have access to courses' : 'Unable to load courses'}>
        {isForbidden ? (
          <Stack gap={4}>
            <Text size="sm">
              Your Strapi account or API token lacks permission to read courses.
            </Text>
            <Text size="sm" c="dimmed">
              In Strapi, enable the <Text span fw={600}>find</Text> and <Text span fw={600}>findOne</Text> permissions for the Courses collection (Settings → Users & Permissions → Roles) or issue an API token with access to <Text span fw={600}>/api/courses</Text>.
            </Text>
          </Stack>
        ) : error instanceof Error ? (
          error.message
        ) : (
          'An unexpected error occurred while loading courses.'
        )}
      </Alert>
    )
  }

  return (
    <Stack>
      <Stack gap={4}>
        <Title order={2}>Courses</Title>
        <Text c="dimmed">
          Browse courses synced from your Strapi backend.
        </Text>
      </Stack>

      {isLoading || isFetching ? (
        <Stack>
          <Skeleton height={220} radius="md" />
          <Skeleton height={220} radius="md" />
        </Stack>
      ) : data?.length ? (
        data.map((course) => <CourseCard key={course.id} course={course} />)
      ) : (
        <Alert color="blue" title="No courses yet">
          Add courses in Strapi to see them listed here. We automatically connect to the
          <Text span fw={600}>
            {' '}
            /api/courses
          </Text>{' '}
          endpoint.
        </Alert>
      )}
    </Stack>
  )
}

export default CoursesPage
