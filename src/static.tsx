import * as React from 'react'
import {
  createSlotsManager,
  getComponentName,
  useIsomorphicEffect,
} from './shared'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = React.createContext(createSlotsManager(components))

  const SlotComponents = Object.keys(components).reduce((acc, slotName) => {
    const name = slotName as K
    const SlotComponent = React.forwardRef((props, ref) => {
      const Slots = React.useContext(SlotsContext)

      useIsomorphicEffect(() => () => Slots.unmount(name), [Slots])

      Slots.update(name, { ...props, ref })
      return null
    }) as unknown as T[K]

    acc[name] = SlotComponent
    return acc
  }, {} as T)

  const createHostComponent = <P extends React.ComponentType>(Component: P) => {
    const HostComponent = React.forwardRef(
      ({ children, ...props }: any, ref) => {
        const Slots = React.useMemo(() => createSlotsManager(components), [])
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
