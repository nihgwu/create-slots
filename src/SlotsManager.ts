import * as React from 'react'

type Slot = React.ElementType

export const createSlotsManager = (onChange: (slot: Slot) => void) => {
  const elementMap = new Map<Slot, React.ReactElement>()
  return {
    register(slot: Slot, element: React.ReactElement) {
      elementMap.set(slot, element)
    },
    update(slot: Slot, element: React.ReactElement) {
      elementMap.set(slot, element)
      onChange(slot)
    },
    unmount(slot: Slot) {
      elementMap.delete(slot)
      onChange(slot)
    },
    get<T extends Slot>(slot: T) {
      return elementMap.get(slot) as
        | React.ReactElement<React.ComponentProps<T>, T>
        | undefined
    },
    getProps<T extends Slot>(slot: T) {
      const element = elementMap.get(slot)
      if (!element) return undefined
      const { ref, props } = element as any
      return (ref ? { ...props, ref } : props) as React.ComponentProps<T>
    },
  }
}
