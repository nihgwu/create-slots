import * as React from 'react'

import { SlotElement } from './utils'

type Key = React.Key

export const createSlotsManager = (onChange: (key: Key) => void) => {
  const itemMap = new Map<Key, React.ReactElement>()
  return {
    register(key: Key, element: React.ReactElement) {
      itemMap.set(key, element)
    },
    update(key: Key, element: React.ReactElement) {
      itemMap.set(key, element)
      onChange?.(key)
    },
    unmount(key: Key) {
      itemMap.delete(key)
      onChange?.(key)
    },
    clear() {
      itemMap.clear()
    },
    has(key: Key) {
      return itemMap.has(key)
    },
    get() {
      return Array.from(itemMap.values()) as SlotElement[]
    },
  }
}
