import React, { useId } from 'react'
import createSlots from 'create-slots'

const Description = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div
    {...props}
    style={{ borderLeft: '4px solid lightgray', paddingLeft: 4 }}
  />
)

const { createHost, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description,
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
      })}
    </div>
  )
}

export const Field = Object.assign(createHost(FieldBase), SlotComponents)
Field.displayName = 'Field'
