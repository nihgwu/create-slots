import React, { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicEffect =
  // istanbul ignore next
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export const getComponentName = (Component: React.ComponentType) =>
  // istanbul ignore next
  Component.displayName || Component.name || 'Component'
