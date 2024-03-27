import { createContext, ReactNode, useContext, useState } from 'react'

const INITIAL_FEATURE_TOGGLES = {
  authWorkflow: process.env.NEXT_PUBLIC_TOGGLE_AUTH_WORKFLOW === 'true',
} as const

type FeatureToggleKey = keyof typeof INITIAL_FEATURE_TOGGLES
type FeatureToggles = { [key in FeatureToggleKey]: boolean }

type Props = {
  toggles: FeatureToggles
}

const FeatureToggleContext = createContext<Props | undefined>(undefined)

/**
 * Returns the FeatureToggleContext from the nearest FeatureToggleProvider in the component tree.
 *
 * @return {FeatureToggleContext} The FeatureToggleContext object.
 * @throws {Error} Throws an error if used outside of a FeatureToggleProvider.
 */
export const useFeatureToggle = () => {
  const context = useContext(FeatureToggleContext)
  if (!context) {
    throw new Error('useFeatureToggle must be used within FeatureToggleProvider')
  }
  return context
}

export const FeatureToggleProvider = (props: { children: ReactNode }) => {
  const [toggles] = useState<FeatureToggles>(INITIAL_FEATURE_TOGGLES)

  return (
    <FeatureToggleContext.Provider value={{ toggles }}>
      {props.children}
    </FeatureToggleContext.Provider>
  )
}
