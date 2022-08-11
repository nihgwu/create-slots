import React, { useState } from 'react'
import { createHost, createSlot } from 'create-slots/rfc'

import { Item } from './RFCItem'

const SelectItem = createSlot<typeof Item>()
const SelectDivider = createSlot('hr')

export const Select = (props: React.ComponentProps<'ul'>) => {
  const [selected, setSelected] = useState<React.ReactNode>(null)

  return (
    <div>
      <div>Selected: {selected}</div>
      {createHost(props.children, (slots) => {
        let index = 0
        return (
          <ul {...props}>
            {slots.map((slot) => {
              if (slot.type === SelectItem) {
                const itemProps = slot.props

                return (
                  <Item
                    key={slot.key}
                    {...slot.props}
                    {...{
                      role: 'button',
                      tabIndex: 0,
                      'data-index': index,
                      'aria-selected': itemProps.children === selected,
                      onClick: () => {
                        setSelected(itemProps.value)
                      },
                      onKeyDown: (
                        event: React.KeyboardEvent<HTMLButtonElement>
                      ) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          setSelected(itemProps.value)
                        }
                      },
                    }}
                  />
                )
              }

              return slot
            })}
          </ul>
        )
      })}
    </div>
  )
}

Select.Item = SelectItem
Select.Divider = SelectDivider

Select.Item.Title = Item.Title
Select.Item.Description = Item.Description
