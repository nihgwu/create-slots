import * as React from 'react'

export const useIsomorphicEffect =
  // istanbul ignore next
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

export const getComponentName = (Component: React.ComponentType) =>
  // istanbul ignore next
  Component.displayName || Component.name || 'Component'
