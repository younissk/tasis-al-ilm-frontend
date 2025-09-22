import { Alert, Avatar, Badge, Button, Card, Group, Image, Skeleton, Stack, Text, Title, Container, Grid, Paper, Tooltip } from '@mantine/core'
import { IconCalendar, IconClock, IconUsers, IconStar, IconArrowRight, IconBook } from '@tabler/icons-react'
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
    <Card 
      key={course.id} 
      withBorder 
      radius="lg" 
      shadow="sm" 
      padding={0}
      className="hover-lift animate-fade-in-up"
      style={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      {course.bannerImage?.url && (
        <Card.Section>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <Image
              src={course.bannerImage.url}
              alt={course.bannerImage.alternativeText ?? `${course.name} banner`}
              height={200}
              style={{ objectFit: 'cover' }}
            />
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(2, 132, 199, 0.2) 100%)'
              }}
            />
            <Group 
              style={{ 
                position: 'absolute', 
                top: 12, 
                right: 12 
              }} 
              gap="xs"
            >
              {course.monthlyPrice !== undefined && (
                <Badge 
                  color="primary" 
                  variant="filled" 
                  size="lg"
                  radius="xl"
                  leftSection={<IconStar size={12} />}
                >
                  Monthly {course.monthlyPrice}
                </Badge>
              )}
              {course.semesterPrice !== undefined && (
                <Badge 
                  color="secondary" 
                  variant="filled" 
                  size="lg"
                  radius="xl"
                  leftSection={<IconBook size={12} />}
                >
                  Semester {course.semesterPrice}
                </Badge>
              )}
            </Group>
          </div>
        </Card.Section>
      )}

      <Stack gap="md" p="lg">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Title order={3} mb="xs" className="gradient-text">
              {course.name}
            </Title>
            {course.schedule && (
              <Group gap="xs" mb="sm">
                <IconClock size={16} color="var(--mantine-color-primary-6)" />
                <Text size="sm" c="dimmed" fw={500}>
                  {course.schedule}
                </Text>
              </Group>
            )}
          </div>
        </Group>

        {(startDate || endDate) && (
          <Paper p="sm" radius="md" bg="primary.0" withBorder>
            <Group gap="xs">
              <IconCalendar size={16} color="var(--mantine-color-primary-6)" />
              <Text size="sm" fw={500}>
                {startDate ? `Starts ${startDate}` : 'Flexible start'}
                {endDate ? ` • Ends ${endDate}` : ''}
              </Text>
            </Group>
          </Paper>
        )}

        {course.description && (
          <Text size="sm" c="dimmed" lineClamp={3} lh={1.6}>
            {course.description}
          </Text>
        )}

        {course.teachers.length > 0 && (
          <Paper p="sm" radius="md" bg="gray.0">
            <Group gap="xs" mb="xs">
              <IconUsers size={16} color="var(--mantine-color-primary-6)" />
              <Text size="sm" fw={600} c="dark">
                Instructors
              </Text>
            </Group>
            <Group gap="xs" wrap="wrap">
              {course.teachers.map((teacher) => (
                <Badge
                  key={teacher.id}
                  component={Link}
                  to={`/teachers/${teacher.documentId ?? teacher.id}`}
                  variant="light"
                  color="primary"
                  size="md"
                  radius="xl"
                >
                  {teacher.name}
                </Badge>
              ))}
            </Group>
          </Paper>
        )}

        <Group justify="space-between" align="center">
          <Group gap="sm">
            {course.teachers.slice(0, 3).map((teacher, index) => (
              <Tooltip key={teacher.id} label={teacher.name}>
                <Avatar 
                  src={teacher.avatar?.url} 
                  alt={teacher.name} 
                  radius="xl" 
                  size="md"
                  style={{ 
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    zIndex: course.teachers.length - index
                  }}
                >
                  {teacher.name?.charAt(0) ?? '?'}
                </Avatar>
              </Tooltip>
            ))}
            {course.teachers.length > 3 && (
              <Avatar radius="xl" size="md" color="primary" style={{ border: '2px solid white' }}>
                +{course.teachers.length - 3}
              </Avatar>
            )}
          </Group>
          <Button 
            component={Link} 
            to={`/courses/${course.documentId ?? course.id}`} 
            variant="gradient"
            gradient={{ from: 'primary', to: 'primary.7', deg: 135 }}
            rightSection={<IconArrowRight size={16} />}
            size="md"
            radius="xl"
            className="hover-lift"
          >
            View Details
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
    <Container size="xl" px="md">
      <Stack gap="xl" className="animate-fade-in">
        {/* Header Section */}
        <Paper p="xl" radius="lg" className="glass-effect" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(2, 132, 199, 0.1) 100%)' }}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1} className="gradient-text" mb="sm">
                Our Courses
              </Title>
              <Text size="lg" c="dimmed" maw={600}>
                Discover comprehensive learning experiences designed to advance your knowledge and skills.
              </Text>
            </div>
            <Badge size="xl" variant="light" color="primary" radius="xl" p="md">
              <Group gap="xs">
                <IconBook size={20} />
                <Text fw={600}>{data?.length || 0} Courses</Text>
              </Group>
            </Badge>
          </Group>
        </Paper>

        {/* Content Section */}
        {isLoading || isFetching ? (
          <Grid>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 4 }}>
                <Skeleton height={400} radius="lg" className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }} />
              </Grid.Col>
            ))}
          </Grid>
        ) : data?.length ? (
          <Grid>
            {data.map((course, index) => (
              <Grid.Col key={course.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <div 
                  className="animate-fade-in-up" 
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <CourseCard course={course} />
                </div>
              </Grid.Col>
            ))}
          </Grid>
        ) : (
          <Paper p="xl" radius="lg" className="glass-effect">
            <Stack align="center" gap="md">
              <IconBook size={64} color="var(--mantine-color-primary-4)" />
              <Title order={3} c="primary">No courses available</Title>
              <Text c="dimmed" ta="center" maw={400}>
                Add courses in Strapi to see them listed here. We automatically connect to the{' '}
                <Text span fw={600} c="primary">/api/courses</Text> endpoint.
              </Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Container>
  )
}

export default CoursesPage
