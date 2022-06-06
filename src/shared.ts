import * as React from 'react'

export const useIsomorphicEffect =
  // istanbul ignore next
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

export const getComponentName = (Component: React.ComponentType) =>
  // istanbul ignore next
  Component.displayName || Component.name || 'Component'

export const createSlotsManager = <T extends Record<string, React.ElementType>>(
  components: T,
  onChange?: (name: keyof T, props: unknown) => void
) => {
  type K = keyof T
  const propsMap = new Map<K, object>()
  return {
    register(name: K, props: object) {
      propsMap.set(name, props)
    },
    update(name: K, props: object) {
      propsMap.set(name, props)
      onChange?.(name, props)
    },
    unmount(name: K) {
      propsMap.delete(name)
      onChange?.(name, null)
    },
    getProps<P extends K>(
      name: P
    ): Partial<React.ComponentProps<T[P]>> | undefined {
      return propsMap.get(name)
    },
    render<P extends K>(
      name: P,
      defaultProps?: Partial<React.ComponentProps<T[P]>>
    ) {
      const props = propsMap.get(name)
      if (!props) return null

      return React.createElement(
        components[name],
        defaultProps ? { ...defaultProps, ...props } : props
      )
    },
    has(name: K) {
      return propsMap.has(name)
    },
  }
}
