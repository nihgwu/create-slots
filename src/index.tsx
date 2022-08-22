import * as React from 'react'

import { createSlotsContext, getComponentName, hoistStatics } from './utils'
import { createSlotsManager } from './SlotsManager'
import { DevChildren } from './DevChildren'

/** @deprecated */
const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  // istanbul ignore next
  const SlotsContext = createSlotsContext(
    createSlotsManager(components, () => {})
  )
  const useSlots = () => React.useContext(SlotsContext)

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    const Slot = React.forwardRef((props, ref) => {
      const Slots = useSlots()

      const mergedProps = ref ? { ...props, ref } : props
      React.useState(() => Slots.register(name, mergedProps))
      React.useEffect(() => Slots.update(name, mergedProps))
      React.useEffect(() => () => Slots.unmount(name), [Slots])

      return null
    }) as unknown as T[K]

    acc[name] = hoistStatics(Slot, components[name])
    return acc
  }, {} as T)

  const createHost = <P extends React.ComponentType<any>>(Component: P) => {
    const displayName = `Host(${getComponentName(Component)})`
    const Host = React.forwardRef(({ children, ...props }: any, ref) => {
      const forceUpdate = React.useReducer(() => [], [])[1]
      const Slots = React.useMemo(
        () => createSlotsManager(components, forceUpdate),
        [forceUpdate]
      )
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

export * from './simple'
