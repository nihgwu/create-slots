import * as React from 'react'

import { createHost, createSlot, isSlot, getSlotProps } from '../list'

const Divider = (props: React.ComponentPropsWithoutRef<'hr'>) => (
  <hr {...props} />
)

const SelectItem = createSlot('li')
const SelectDivider = createSlot(Object.assign(Divider, { foo: 'Foo' }))

export const Select = (props: React.ComponentPropsWithoutRef<'ul'>) => {
  const [selected, setSelected] = React.useState<string>()
  const indexRef = React.useRef(0)

  return (
    <div>
      <div>Selected: {selected ?? ''}</div>
      {createHost(props.children, (slots) => {
        indexRef.current = 0
        return (
          <ul {...props}>
            {slots.map((slot) => {
              if (isSlot(slot, SelectItem)) {
                const slotProps = getSlotProps(slot)
                return (
                  <li
                    {...slotProps}
                    role="option"
                    data-index={indexRef.current++}
                    aria-selected={slotProps.value === selected}
                    onClick={() => setSelected(slotProps.value as string)}
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
