import * as React from 'react'

export type SlotElement<T extends React.ElementType = any> = React.ReactElement<
  React.ComponentPropsWithRef<T>,
  T
> & {
  ref: React.ComponentPropsWithRef<T>['ref']
}

export const getSlots = <T extends React.ElementType>(
  slots: React.ReactElement[],
  slot: T
) => {
  return slots.filter((x) => x.type === slot) as SlotElement<T>[]
}

export const getSlot = <T extends React.ElementType>(
  slots: React.ReactElement[],
  slot: T
) => {
  return slots.find((x) => x.type === slot) as SlotElement<T> | undefined
}

export const getLastSlot = <T extends React.ElementType>(
  slots: React.ReactElement[],
  slot: T
) => {
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i].type === slot) {
      return slots[i] as SlotElement<T>
    }
  }
  return undefined
}
