import * as React from 'react'

export const useIsomorphicEffect =
  typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

export const createSlotsManager = <T extends Record<string, React.ElementType>>(
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
