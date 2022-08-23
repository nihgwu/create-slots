import * as React from 'react'

import { createSlotsContext, getComponentName, hoistStatics } from '../utils'
import { DevChildren } from '../DevChildren'
import { ScanContext, ScanProvider } from '../ScanContext'
import { createSlotsManager } from './SlotsManager'
export type { GetPropsArgs } from './SlotsManager'

/** @deprecated */
const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = createSlotsContext(createSlotsManager(components))
  const useSlots = () => React.useContext(SlotsContext)

  let _id = 0
  const getId = () => {
    return `$c${_id++}s$`
  }

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    const Slot = React.forwardRef(({ $slot_key$: key, ...props }: any, ref) => {
      const Scan = React.useContext(ScanContext)
      const Slots = useSlots()

      const mergedProps = ref ? { ...props, ref } : props
      Slots.register(key, name, mergedProps)
      React.useEffect(() => {
        Slots.has(key) && Slots.update(key, name, mergedProps)
      })
      React.useEffect(() => {
        Slots.clear()
        Scan.rescan()
        return () => Slots.unmount(key)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [Slots])

      return null
    }) as unknown as T[K]

    // provide stable key in StrictMode
    const SlotWithKey = React.forwardRef((props: any, ref) => {
      const [key] = React.useState(getId)
      return <Slot ref={ref} $slot_key$={key} {...props} />
    }) as unknown as T[K]

    acc[name] = hoistStatics(SlotWithKey, components[name])
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
          <ScanProvider>
            {process.env.NODE_ENV === 'development' ? (
              <DevChildren name={displayName}>{children}</DevChildren>
            ) : (
              children
            )}
          </ScanProvider>
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

export * from '../rfc'
