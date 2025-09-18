import { Anchor, Button, Center, Stack, Text, Title } from '@mantine/core'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

function NotFoundPage() {
  const error = useRouteError()
  const isResponseError = isRouteErrorResponse(error)
  const status = isResponseError ? error.status : 404
  const message = isResponseError ? error.statusText : 'The page you are looking for does not exist.'

  return (
    <Center style={{ minHeight: '60vh' }}>
      <Stack align="center" gap="xs">
        <Title order={2}>Error {status}</Title>
        <Text c="dimmed" ta="center">
          {message}
        </Text>
        <Button component={Link} to="/" variant="light">
          Go back home
        </Button>
        <Text size="sm" c="dimmed">
          Need help? <Anchor component="a" href="mailto:support@tasisalilm.com">Contact support</Anchor>
        </Text>
      </Stack>
    </Center>
  )
}

export default NotFoundPage
