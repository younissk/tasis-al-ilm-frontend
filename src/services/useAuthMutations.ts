import { useMutation } from '@tanstack/react-query'
import type { UseMutationOptions } from '@tanstack/react-query'
import { useAuth } from '../providers/AuthProvider.tsx'
import type { AuthSession, LoginCredentials, RegisterPayload } from './authClient.ts'

export function useLoginMutation(options?: UseMutationOptions<AuthSession, Error, LoginCredentials>) {
  const { signIn } = useAuth()

  return useMutation<AuthSession, Error, LoginCredentials>({
    mutationFn: signIn,
    ...options,
  })
}

export function useLogoutMutation(options?: UseMutationOptions<void, Error, void>) {
  const { signOut } = useAuth()

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      signOut()
    },
    ...options,
  })
}

export function useRegisterMutation(options?: UseMutationOptions<AuthSession, Error, RegisterPayload>) {
  const { signUp } = useAuth()

  return useMutation<AuthSession, Error, RegisterPayload>({
    mutationFn: signUp,
    ...options,
  })
}
