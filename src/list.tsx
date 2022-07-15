import * as React from 'react'

import { getComponentName, useIsomorphicEffect } from './utils'
import { createSlotsManager } from './list/SlotsManager'
import { ScanContext, ScanProvider } from './list/ScanContext'
export type { GetPropsArgs } from './list/SlotsManager'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = React.createContext(createSlotsManager(components))

  let _id = 0
  const getId = () => {
    return `$c${_id++}s$`
  }

  const SlotComponents = Object.keys(components).reduce((acc, slotName) => {
    const name = slotName as K
    const SlotComponent = React.memo(
      React.forwardRef(({ $slot_key$: key, ...props }: any, ref) => {
        const Slots = React.useContext(SlotsContext)
        const Scan = React.useContext(ScanContext)

        const mergedProps = ref ? { ...props, ref } : props
        Slots.register(key, name, mergedProps)
        useIsomorphicEffect(() => {
          Slots.has(key) && Slots.update(key, name, mergedProps)
        })
        useIsomorphicEffect(() => {
          Slots.clear()
          Scan.rescan()
          return () => Slots.unmount(key)
        }, [Slots])

        return null
      })
    ) as unknown as T[K]

    // provide stable key in StrictMode
    const SlotComponentWithKey = React.forwardRef((props: any, ref) => {
      const [key] = React.useState(getId)
      return <SlotComponent ref={ref} $slot_key$={key} {...props} />
    }) as unknown as T[K]

    const TargetComponent = components[name]
    acc[name] =
      typeof TargetComponent !== 'string'
        ? Object.assign({}, TargetComponent, SlotComponentWithKey)
        : SlotComponentWithKey
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
            <ScanProvider>{children}</ScanProvider>
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