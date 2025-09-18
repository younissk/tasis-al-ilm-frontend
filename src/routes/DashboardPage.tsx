import { Card, SimpleGrid, Text, Title } from '@mantine/core'

const dashboardCards = [
  { title: 'Active Courses', value: '0', description: 'Connect Strapi to see live data.' },
  { title: 'Enrolled Students', value: '0', description: 'Coming soon.' },
  { title: 'Assignments Due', value: '0', description: 'Track assignments from Strapi.' },
]

function DashboardPage() {
  return (
    <div>
      <Title order={2} mb="lg">
        Welcome back
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        {dashboardCards.map((card) => (
          <Card key={card.title} radius="md" shadow="sm" padding="lg">
            <Text size="sm" c="dimmed">
              {card.title}
            </Text>
            <Title order={3}>{card.value}</Title>
            <Text size="sm" mt="sm">
              {card.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  )
}

export default DashboardPage
