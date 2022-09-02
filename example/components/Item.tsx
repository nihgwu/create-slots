import React, { useId } from 'react'
import { createHost, createSlot, getSlot } from 'create-slots/list'

type ItemProps = Omit<React.ComponentPropsWithoutRef<'li'>, 'value'> & {
  value: string
}

const ItemTitle = createSlot<'h4'>()
const ItemDescription = createSlot<'div'>()

export const Item = (props: ItemProps) => {
  const id = useId()

  return createHost(props.children, (slots) => {
    const titleSlot = getSlot(slots, ItemTitle)
    const descriptionSlot = getSlot(slots, ItemDescription)
    const titleId = titleSlot ? `${id}-title` : undefined
    const descId = descriptionSlot ? `${id}-desc` : undefined

    return (
      <li aria-describedby={descId} aria-label={titleId} {...props}>
        {titleSlot && (
          <h4 id={titleId} ref={titleSlot.ref} {...titleSlot.props} />
        )}
        {descriptionSlot && (
          <div
            id={descId}
            ref={descriptionSlot.ref}
            {...descriptionSlot.props}
          />
        )}
      </li>
    )
  })
}

Item.Title = ItemTitle
Item.Description = ItemDescription
