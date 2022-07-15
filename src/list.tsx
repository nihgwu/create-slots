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
  const useSlots = () => React.useContext(SlotsContext)

  let _id = 0
  const getId = () => {
    return `$c${_id++}s$`
  }

  const createSlot = <P extends K>(name: P) => {
    const Slot = React.memo(
      React.forwardRef(({ $slot_key$: key, ...props }: any, ref) => {
        const Scan = React.useContext(ScanContext)
        const Slots = useSlots()

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
    const SlotWithKey = React.forwardRef((props: any, ref) => {
      const [key] = React.useState(getId)
      return <Slot ref={ref} $slot_key$={key} {...props} />
    }) as unknown as T[K]

    const Target = components[name]
    return typeof Target !== 'string'
      ? Object.assign({}, Target, SlotWithKey)
      : SlotWithKey
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
          <ScanProvider>{children}</ScanProvider>
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
