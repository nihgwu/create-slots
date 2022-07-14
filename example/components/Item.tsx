import React, { useId } from 'react'
import createSlots from 'create-slots'

type ItemProps = Omit<React.ComponentPropsWithoutRef<'li'>, 'value'> & {
  value: string
}

const { createHostComponent, SlotComponents, useSlots } = createSlots({
  Title: 'h3',
  Description: 'div',
})

const ItemBase = (props: ItemProps) => {
  const Slots = useSlots()
  const id = useId()
  const titleId = Slots.has('Title') ? `${id}-title` : undefined
  const descId = Slots.has('Description') ? `${id}-desc` : undefined

  return (
    <li aria-describedby={descId} aria-label={titleId} {...props}>
      {Slots.render('Title', { id: titleId })}
      {Slots.render('Description', { id: descId })}
    </li>
  )
}

export const Item = Object.assign(createHostComponent(ItemBase), SlotComponents)
