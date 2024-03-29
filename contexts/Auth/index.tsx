import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext } from 'react'

import { useFeatureToggle } from '@/contexts/FeatureToggle'
import { useUserGet } from '@/hooks/User/useUserGetOld'
import { User } from '@/types/User'

type Props = {
  user?: User
  loading: boolean
  authenticated: boolean
}

const AuthContext = createContext<Props | undefined>(undefined)

/**
 * Returns the authentication context from the nearest AuthProvider.
 *
 * @return {AuthContext} The authentication context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

/**
 * AuthProvider component to provide authentication context to its children.
 *
 * @param {Object} props - The props object with children as ReactNode
 * @return {ReactNode} The provider component with authentication context
 */
export const AuthProvider = (props: { children: ReactNode }) => {
  const router = useRouter()
  const { toggles } = useFeatureToggle()

  const { data, isLoading, isSuccess } = useUserGet({
    enabled: toggles.authWorkflow && router.pathname !== '/',
    onError: () => {
      if (router.pathname === '/login') return
      router.push('/login')
    },
  })

  const client = {
    user: data?.user,
    loading: isLoading,
    authenticated: isSuccess,
  }

  return <AuthContext.Provider value={client}>{props.children}</AuthContext.Provider>
}
