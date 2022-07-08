import * as React from 'react'

type Key = React.Key

export const createSlotsManager = <T extends Record<string, React.ElementType>>(
  components: T,
  onChange?: (key: Key, props: object | null) => void
) => {
  type K = keyof T
  type GetPropsArgs<KK extends K = K> = {
    [P in KK]: {
      name: P
      props: React.ComponentProps<T[P]>
      index: number
      totalIndex: number
    }
  }[KK]

  const itemMap = new Map<Key, { name: K; props: object }>()
  return {
    register(key: Key, name: K, props: object) {
      itemMap.set(key, { name, props })
    },
    update(key: Key, name: K, props: object) {
      itemMap.set(key, { name, props })
      onChange?.(key, props)
    },
    unmount(key: Key) {
      if (!itemMap.has(key)) return
      itemMap.delete(key)
      onChange?.(key, null)
    },
    clear() {
      itemMap.clear()
    },
    getItems() {
      const counter = Object.keys(components).reduce((obj, name: K) => {
        obj[name] = 0
        return obj
      }, {} as Record<K, number>)
      return Array.from(itemMap).map(([key, { name, props }], idx) => {
        return { key, name, props, index: counter[name]++, totalIndex: idx }
      })
    },
    renderItems(
      getProps?: ({ name, props, index }: GetPropsArgs) => object | undefined
    ) {
      return this.getItems().map(({ key, name, props, ...rest }) => {
        return React.createElement(components[name], {
          key,
          ...(getProps?.({ name, props: props as any, ...rest }) || props),
        })
      })
    },
    has(key: Key) {
      return itemMap.has(key)
    },
  }
}
