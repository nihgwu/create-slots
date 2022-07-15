import React, {
  createContext,
  forwardRef,
  memo,
  useContext,
  useReducer,
  useState,
  useMemo,
} from 'react'

import { getComponentName, useIsomorphicEffect } from './utils'
import { createSlotsManager } from './list/SlotsManager'
import { ScanContext, ScanProvider } from './list/ScanContext'
export type { GetPropsArgs } from './list/SlotsManager'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  const SlotsContext = createContext(createSlotsManager(components))
  const useSlots = () => useContext(SlotsContext)

  let _id = 0
  const getId = () => {
    return `$c${_id++}s$`
  }

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    const Slot = memo(
      forwardRef(({ $slot_key$: key, ...props }: any, ref) => {
        const Scan = useContext(ScanContext)
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
    const SlotWithKey = forwardRef((props: any, ref) => {
      const [key] = useState(getId)
      return <Slot ref={ref} $slot_key$={key} {...props} />
    }) as unknown as T[K]

    const Target = components[name]
    acc[name] =
      typeof Target !== 'string'
        ? Object.assign({}, Target, SlotWithKey)
        : SlotWithKey
    return acc
  }, {} as T)

  const createHost = <P extends React.ComponentType<any>>(Component: P) => {
    const Host = forwardRef(({ children, ...props }: any, ref) => {
      const forceUpdate = useReducer(() => [], [])[1]
      const Slots = useMemo(
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
    useSlots,
  }
}

export default createSlots
