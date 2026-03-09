import { computed } from 'vue'
import { authClient } from '@/lib/auth-client'

export function useAuth() {
  const session = authClient.useSession()

  const user = computed(() => session.value.data?.user ?? null)
  const isAuthenticated = computed(() => !!session.value.data?.user)
  const isPending = computed(() => session.value.isPending)

  const signInWithGoogle = async (callbackURL = '/') => {
    await authClient.signIn.social({ provider: 'google', callbackURL })
  }

  const logout = async () => {
    await authClient.signOut()
  }

  return { session, user, isAuthenticated, isPending, signInWithGoogle, logout }
}
