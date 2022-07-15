import React, { useId } from 'react'
import createSlots from 'create-slots'

const { createHost, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description: 'div',
})

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const id = useId()
  const inputId = Slots.getProps('Input')?.id || `${id}-label`
  const descriptionId = Slots.has('Description') ? `${id}-desc` : undefined

  return (
    <div {...props}>
      {Slots.render('Label', { htmlFor: inputId })}
      {Slots.render('Input', {
        id: inputId,
        'aria-describedby': descriptionId,
      })}
      {Slots.render('Description', {
        id: descriptionId,
        style: { color: 'gray' },
      })}
    </div>
  )
}

export const Field = Object.assign(createHost(FieldBase), SlotComponents)
Field.displayName = 'Field'
