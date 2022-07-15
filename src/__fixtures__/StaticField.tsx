import * as React from 'react'

import createSlots from '../static'

const Description = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} />
)

const { createHost, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description: Object.assign(Description, { foo: 'Foo' }),
  Icon: 'span',
})

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const id = ':r0:'
  const descriptionId = ':r1:'
  const inputId = Slots.getProps('Input')?.id || id

  return (
    <div {...props}>
      {Slots.render('Label', { htmlFor: inputId })}
      {Slots.render('Input', {
        id: inputId,
        'aria-describedby': Slots.has('Description')
          ? descriptionId
          : undefined,
      })}
      {(Slots.has('Icon') || Slots.has('Description')) && (
        <div>
          {Slots.render('Icon')}
          {Slots.render('Description', { id: descriptionId })}
        </div>
      )}
    </div>
  )
}

export const StaticField = Object.assign(createHost(FieldBase), SlotComponents)
