import * as React from 'react'

import { createSlotsContext, getComponentName, hoistStatics } from '../utils'
import { DevChildren } from '../DevChildren'
import { createSlotsManager } from './SlotsManager'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = createSlotsContext(createSlotsManager(components))
  const useSlots = () => React.useContext(SlotsContext)

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    const Slot = React.forwardRef((props, ref) => {
      const Slots = React.useContext(SlotsContext)

      Slots.register(name, { ...props, ref })

      return null
    }) as unknown as T[K]

    acc[name] = hoistStatics(Slot, components[name])
    return acc
  }, {} as T)

  const createHost = <P extends React.ComponentType>(Component: P) => {
    const displayName = `Host(${getComponentName(Component)})`
    const Host = React.forwardRef(({ children, ...props }: any, ref) => {
      const Slots = React.useMemo(() => createSlotsManager(components), [])
      Slots.clear()
      return (
        <SlotsContext.Provider value={Slots}>
          {process.env.NODE_ENV === 'development' ? (
            <DevChildren name={displayName}>{children}</DevChildren>
          ) : (
            children
          )}
          <Component ref={ref} {...props} />
        </SlotsContext.Provider>
      )
    }) as unknown as P
    Host.displayName = displayName

    return Host
  }

  return { SlotComponents, createHost, useSlots }
}

export default createSlots
