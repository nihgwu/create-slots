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

      useIsomorphicEffect(() => () => Slots.unmount(name), [Slots])

      Slots.update(name, props)
      return null
    }) as T[K]

    acc[name] = SlotComponent
    return acc
  }, {} as T)

  const createHostComponnet = <P extends React.ComponentType>(Component: P) => {
    const HostComponent = (({ children, ...props }: any) => {
      const Slots = React.useMemo(() => createSlotsManager(components), [])
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
    createHostComponnet,
    useSlots,
  }
}

export default createSlots
