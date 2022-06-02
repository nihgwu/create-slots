import * as React from 'react'

const useIsomorphicEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

const createSlotsManager = <T extends Record<string, React.ElementType>>(
  components: T,
  onChange?: (name: keyof T, props: unknown) => void
) => {
  type K = keyof T
  const propsMap = {} as Record<K, object | null>
  return {
    register(name: K, props: object) {
      propsMap[name] = props
    },
    update(name: K, props: object) {
      propsMap[name] = props
      onChange?.(name, props)
    },
    unmount(name: K) {
      propsMap[name] = null
      onChange?.(name, null)
    },
    getProps(name: K) {
      return propsMap[name]
    },
    render<P extends K>(
      name: P,
      defaultProps?: Partial<React.ComponentProps<T[P]>>
    ) {
      const props = propsMap[name]
      if (!props) return null

      return React.createElement(
        components[name],
        defaultProps ? { ...defaultProps, ...props } : props
      )
    },
    has(name: K) {
      return !!propsMap[name]
    },
  }
}

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

  const createHostComponnet = <P extends React.ComponentType>(Component: P) => {
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
    createHostComponnet,
    useSlots,
  }
}

export default createSlots
