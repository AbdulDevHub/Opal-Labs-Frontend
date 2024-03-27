import { createContext, ReactNode, useContext, useState } from 'react'

import { API } from '@/apiUseless/client'
import { config } from '@/apiUseless/schema'
import useFetch from '@/apiUseless/useFetch'
import { QueryClientProvider } from '@tanstack/react-query'

type Endpoints = ReturnType<typeof config>
type Props = API<Endpoints>

const APIContext = createContext<Props | undefined>(undefined)

/**
 * Returns the API context from the nearest `APIProvider` in the component tree.
 *
 * @return {APIContext} The API context object.
 */
export const useAPI = () => {
  const context = useContext(APIContext)
  if (!context) {
    throw new Error('useAPI must be used within APIProvider')
  }
  return context
}

/**
 * APIProvider component that provides the API client to the entire application.
 *
 * @param {{ children: ReactNode }} props - the children components to be wrapped by the APIProvider
 * @return {ReactNode} the wrapped children component with API client provided
 */
export const APIProvider = (props: { children: ReactNode }) => {
  const [client] = useState(new API(config(useFetch())))

  return (
    <QueryClientProvider client={client.queryClient}>
      <APIContext.Provider value={client}>{props.children}</APIContext.Provider>
    </QueryClientProvider>
  )
}
