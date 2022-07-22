import React, {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useReducer,
  useState,
  useMemo,
} from 'react'

import { createSlotsContext, getComponentName, hoistStatics } from './utils'
import { createSlotsManager } from './SlotsManager'

const createSlots = <T extends Record<string, React.ElementType>>(
  components: T
) => {
  type K = keyof T
  // istanbul ignore next
  const SlotsContext = createSlotsContext(
    createSlotsManager(components, () => {})
  )
  const useSlots = () => useContext(SlotsContext)

  const SlotComponents = Object.keys(components).reduce((acc, name: K) => {
    const Slot = memo(
      forwardRef((props, ref) => {
        const Slots = useSlots()

        const mergedProps = ref ? { ...props, ref } : props
        useState(() => Slots.register(name, mergedProps))
        useEffect(() => Slots.update(name, mergedProps))
        useEffect(() => () => Slots.unmount(name), [Slots])

        return null
      })
    ) as unknown as T[K]

    acc[name] = hoistStatics(Slot, components[name])
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
    useSlots,
  }
}

export default createSlots
