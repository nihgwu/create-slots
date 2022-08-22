import * as React from 'react'

export const createSlotsContext = <T>(defaultValue: T) => {
  const context = React.createContext(defaultValue)
  context.displayName = 'SlotsContext'
  return context
}

export const getComponentName = (Component: React.ElementType) => {
  if (typeof Component === 'string') return Component
  // istanbul ignore next
  return Component.displayName || Component.name || 'Component'
}

const REACT_STATICS = ['$$typeof', 'render', 'displayName', 'defaultProps']

export const hoistStatics = <T extends React.ElementType>(
  target: T,
  source: T
) => {
  if (typeof source === 'string') return target

  const statics = Object.getOwnPropertyNames(source).reduce((obj, key) => {
    if (!REACT_STATICS.includes(key)) {
      obj[key] = (source as any)[key]
    }
    return obj
  }, {} as Record<string, any>)

  return Object.assign(target, statics)
}
