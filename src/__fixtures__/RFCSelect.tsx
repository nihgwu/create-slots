import * as React from 'react'

import { createHost, createSlot } from '../rfc'

const Divider = (props: React.ComponentPropsWithoutRef<'hr'>) => (
  <hr {...props} />
)

const SelectItem = createSlot('li')
const SelectDivider = createSlot(Divider)

export const Select = (props: React.ComponentPropsWithoutRef<'ul'>) => {
  const [selected, setSelected] = React.useState<React.ReactElement>()
  const indexRef = React.useRef(0)

  return (
    <div>
      <div>Selected: {selected?.props.value ?? ''}</div>
      {createHost(props.children, (slots) => {
        indexRef.current = 0
        return (
          <ul {...props}>
            {slots.map((slot) => {
              if (slot.type === SelectItem) {
                const itemProps = slot.props

                return (
                  <li
                    key={slot.key}
                    ref={slot.ref}
                    {...itemProps}
                    {...{
                      'data-index': indexRef.current++,
                      'aria-selected': slot === selected,
                      onClick: () => {
                        setSelected(slot)
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
