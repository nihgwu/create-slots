import React, { createContext } from 'react'

export const createSlotsContext = <T>(defaultValue: T) => {
  const context = createContext(defaultValue)
  context.displayName = 'SlotsContext'
  return context
}

export const getComponentName = (Component: React.ElementType) => {
  if (typeof Component === 'string') return Component
  // istanbul ignore next
  return Component.displayName || Component.name || 'Component'
}

export const hoistStatics = <T extends React.ElementType>(
  target: T,
  source: T
) => {
  return typeof source !== 'string' ? Object.assign({}, source, target) : target
}
