import React, { createContext, forwardRef, useContext, useMemo } from 'react'

import { createSlotsManager } from './SlotsManager'
import { getComponentName, useIsomorphicEffect } from './utils'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = createContext(createSlotsManager(components))
  const useSlots = () => useContext(SlotsContext)

  const createSlot = <P extends K>(name: P) => {
    const Slot = forwardRef((props, ref) => {
      const Slots = useContext(SlotsContext)

      useIsomorphicEffect(() => () => Slots.unmount(name), [Slots])

      Slots.update(name, { ...props, ref })
      return null
    }) as unknown as T[K]

    const Target = components[name]
    return typeof Target !== 'string' ? Object.assign({}, Target, Slot) : Slot
  }

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    acc[name] = createSlot(name)
    return acc
  }, {} as T)

  const createHost = <P extends React.ComponentType>(Component: P) => {
    const Host = forwardRef(({ children, ...props }: any, ref) => {
      const Slots = useMemo(() => createSlotsManager(components), [])
      return (
        <SlotsContext.Provider value={Slots}>
          {children}
          <Component ref={ref} {...props} />
        </SlotsContext.Provider>
      )
    }) as unknown as P
    Host.displayName = `Host(${getComponentName(Component)})`

    return Host
  }

  return {
    SlotsContext,
    SlotComponents,
    createHost,
    createSlot,
    useSlots,
  }
}

export default createSlots
