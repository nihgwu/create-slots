import * as React from 'react'
import { createSlotsManager, useIsomorphicEffect } from './shared'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = React.createContext(createSlotsManager(components))

  const SlotComponents = Object.keys(components).reduce((acc, slotName) => {
    const name = slotName as K
    const SlotComponent = ((props) => {
      const Slots = React.useContext(SlotsContext)

      React.useState(() => Slots.register(name, props))
      useIsomorphicEffect(() => Slots.update(name, props))
      useIsomorphicEffect(() => () => Slots.unmount(name), [Slots])

      return null
    }) as T[K]

    acc[name] = SlotComponent
    return acc
  }, {} as T)

  const createHostComponent = <P extends React.ComponentType>(Component: P) => {
    const HostComponent = (({ children, ...props }: any) => {
      const forceUpdate = React.useReducer(() => [], [])[1]
      const Slots = React.useMemo(
        () => createSlotsManager(components, forceUpdate),
        [forceUpdate]
      )
      return (
        <SlotsContext.Provider value={Slots}>
          {children}
          <Component {...props} />
        </SlotsContext.Provider>
      )
    }) as P
    HostComponent.displayName = `Host(${
      Component.displayName || Component.name || 'Component'
    })`

    return HostComponent
  }

  const useSlots = () => {
    const Slots = React.useContext(SlotsContext)

    return React.useMemo(
      () => ({
        getProps: Slots.getProps,
        render: Slots.render,
        has: Slots.has,
      }),
      [Slots]
    )
  }

  return {
    SlotsContext,
    SlotComponents,
    createHostComponent,
    useSlots,
  }
}

export default createSlots
