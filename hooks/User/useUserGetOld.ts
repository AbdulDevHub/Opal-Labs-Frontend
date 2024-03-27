import { useAPI } from '@/contexts/API'

type Props = {
  enabled?: boolean
  onSuccess?: () => void
  onError?: () => void
}

/** IMPORTANT: Do not use this directly, use useAuth */

/**
 * Returns a custom hook that makes a GET request to retrieve user data.
 *
 * @param {Props} props - Optional props object containing the following properties:
 *   - enabled: A boolean indicating whether the hook should be enabled.
 *   - onSuccess: A callback function to be called on successful response.
 *   - onError: A callback function to be called on error response.
 * @return {QueryResult} The result of the useQuery hook from the useAPI custom hook.
 */
export const useUserGet = (props?: Props) => {
  return useAPI().useQuery(['userGet', null], {
    enabled: props?.enabled,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: props?.onSuccess,
    onError: props?.onError,
  })
}
