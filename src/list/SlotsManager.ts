import * as React from 'react'

type Key = React.Key

export type GetPropsArgs<
  T extends Record<string, React.ElementType>,
  K extends keyof T = keyof T
> = {
  [P in K]: {
    name: P
    props: React.ComponentPropsWithRef<T[P]>
    index: number
    totalIndex: number
  }
}[K]

export const createSlotsManager = <T extends Record<string, React.ElementType>>(
  components: T,
  onChange?: (key: Key) => void
) => {
  type K = keyof T

  const itemMap = new Map<Key, { name: K; props: object }>()
  return {
    register(key: Key, name: K, props: object) {
      itemMap.set(key, { name, props })
    },
    update(key: Key, name: K, props: object) {
      itemMap.set(key, { name, props })
      onChange?.(key)
    },
    unmount(key: Key) {
      itemMap.delete(key)
      onChange?.(key)
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
    renderItems(getItemProps?: (args: GetPropsArgs<T>) => object | undefined) {
      return this.getItems().map(({ key, name, props, ...rest }) => {
        return React.createElement(components[name], {
          key,
          ...(getItemProps?.({ name, props: props as any, ...rest }) || props),
        })
      })
    },
    has(key: Key) {
      return itemMap.has(key)
    },
  }
}
