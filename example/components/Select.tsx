import React, { useState } from 'react'
import createSlots from 'create-slots/list'

import { Item } from './Item'

const { createHost, SlotComponents, useSlots } = createSlots({
  Item,
  Divider: 'hr',
})

const SelectBase: React.FC<React.ComponentPropsWithoutRef<'ul'>> = (props) => {
  const [selected, setSelected] = useState<React.ReactNode>(null)
  const slotItems = useSlots().renderItems(
    ({ name, props: itemProps, index }) => {
      if (name === 'Item') {
        return {
          ...itemProps,
          role: 'button',
          tabIndex: 0,
          'data-index': index,
          'aria-selected': itemProps.children === selected,
          onClick: () => {
            setSelected(itemProps.value)
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setSelected(itemProps.value)
            }
          }
        }
      }
    }
  )

  return (
    <div>
      <div>Selected: {selected}</div>
      <ul {...props}>{slotItems}</ul>
    </div>
  )
}

export const Select = Object.assign(
  createHost(SelectBase),
  SlotComponents
)
