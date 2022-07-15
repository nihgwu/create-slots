import * as React from 'react'

import { getComponentName, useIsomorphicEffect } from './utils'
import { createSlotsManager } from './SlotsManager'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = React.createContext(createSlotsManager(components))
  const useSlots = () => React.useContext(SlotsContext)

  const createSlot = <P extends K>(name: P) => {
    const Slot = React.memo(
      React.forwardRef((props, ref) => {
        const Slots = useSlots()

        const mergedProps = ref ? { ...props, ref } : props
        React.useState(() => Slots.register(name, mergedProps))
        useIsomorphicEffect(() => Slots.update(name, mergedProps))
        useIsomorphicEffect(() => () => Slots.unmount(name), [Slots])

        return null
      })
    ) as unknown as T[K]

    const Target = components[name]
    return typeof Target !== 'string' ? Object.assign({}, Target, Slot) : Slot
  }

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    acc[name] = createSlot(name)
    return acc
  }, {} as T)

  const createHost = <P extends React.ComponentType<any>>(Component: P) => {
    const Host = React.forwardRef(({ children, ...props }: any, ref) => {
      const forceUpdate = React.useReducer(() => [], [])[1]
      const Slots = React.useMemo(
        () => createSlotsManager(components, forceUpdate),
        [forceUpdate]
      )
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
