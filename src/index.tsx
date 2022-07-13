import * as React from 'react'

import { getComponentName, useIsomorphicEffect } from './utils'
import { createSlotsManager } from './SlotsManager'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = React.createContext(createSlotsManager(components))

  const SlotComponents = Object.keys(components).reduce((acc, slotName) => {
    const name = slotName as K
    const SlotComponent = React.memo(
      React.forwardRef((props, ref) => {
        const Slots = React.useContext(SlotsContext)

        const mergedProps = ref ? { ...props, ref } : props
        React.useState(() => Slots.register(name, mergedProps))
        useIsomorphicEffect(() => Slots.update(name, mergedProps))
        useIsomorphicEffect(() => () => Slots.unmount(name), [Slots])

        return null
      })
    ) as unknown as T[K]

    const TargetComponent = components[name]
    acc[name] =
      typeof TargetComponent !== 'string'
        ? Object.assign({}, TargetComponent, SlotComponent)
        : SlotComponent
    return acc
  }, {} as T)

  const createHostComponent = <P extends React.ComponentType<any>>(
    Component: P
  ) => {
    const HostComponent = React.forwardRef(
      ({ children, ...props }: any, ref) => {
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
      }
    ) as unknown as P
    HostComponent.displayName = `Host(${getComponentName(Component)})`

    return HostComponent
  }

  const useSlots = () => React.useContext(SlotsContext)

  return {
    SlotsContext,
    SlotComponents,
    createHostComponent,
    useSlots,
  }
}

export default createSlots
