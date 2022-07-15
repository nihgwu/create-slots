import * as React from 'react'

import createSlots, { GetPropsArgs } from '../list'

const Divider = (props: React.ComponentPropsWithoutRef<'hr'>) => (
  <hr {...props} />
)

const { createHost, SlotComponents, useSlots } = createSlots({
  Item: 'li',
  Divider: Object.assign(Divider, { foo: 'Foo' }),
})

const SelectBase: React.FC<React.ComponentPropsWithoutRef<'ul'>> = (props) => {
  const Slots = useSlots()
  type SlotItem = Extract<GetPropsArgs<typeof SlotComponents>, { name: 'Item' }>
  const [selected, setSelected] = React.useState<SlotItem>()
  const slotItems = Slots.renderItems((item) => {
    if (item.name === 'Item') {
      return {
        ...item.props,
        'data-index': item.index,
        'aria-selected': item === selected,
        onClick: () => {
          setSelected(item)
        },
      }
    }
  })

  return (
    <div>
      <div>Selected: {selected?.props.value ?? ''}</div>
      <ul {...props}>{slotItems}</ul>
    </div>
  )
}

export const Select = Object.assign(createHost(SelectBase), SlotComponents)
