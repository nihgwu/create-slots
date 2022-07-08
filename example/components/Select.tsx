import React, { useId, useState } from 'react'
import createListSlots from 'create-slots/list'
import createSlots from 'create-slots'

import { Item } from './Item'

const { createHostComponent, SlotComponents, useSlots } = createListSlots({
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
          'data-index': index,
          'aria-selected': itemProps.children === selected,
          onClick: () => {
            setSelected(itemProps.value)
          },
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
  createHostComponent(SelectBase),
  SlotComponents
)
