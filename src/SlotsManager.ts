import { createElement } from 'react'

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
    getProps<P extends K>(name: P) {
      return propsMap.get(name) as React.ComponentPropsWithRef<T[P]> | undefined
    },
    render<P extends K>(
      name: P,
      defaultProps?: Partial<React.ComponentPropsWithRef<T[P]>>,
      finalProps?: React.ComponentPropsWithRef<T[P]>
    ) {
      const props = propsMap.get(name)
      if (!props) return null

      return createElement(
        components[name],
        finalProps || (defaultProps ? { ...defaultProps, ...props } : props)
      )
    },
    has(name: K) {
      return propsMap.has(name)
    },
  }
}
