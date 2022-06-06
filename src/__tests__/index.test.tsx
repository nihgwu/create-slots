import * as React from 'react'
import { create } from 'react-test-renderer'
import createSlots from '../'

const { createHostComponent, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description: 'p',
  Icon: 'span',
})

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const id = React.useId()
  const descriptionId = React.useId()
  const inputId = Slots.getProps('Input')?.['id'] || id

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

export const Field = Object.assign(
  createHostComponent(FieldBase),
  SlotComponents
)

test('render slots', () => {
  const instance = create(
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input />
      <Field.Icon>-</Field.Icon>
      <Field.Description>Description</Field.Description>
    </Field>
  )
  expect(instance).toMatchInlineSnapshot(`
<div>
  <label
    htmlFor=":r0:"
  >
    Label
  </label>
  <input
    aria-describedby=":r1:"
    id=":r0:"
  />
  <div>
    <span>
      -
    </span>
    <p
      id=":r1:"
    >
      Description
    </p>
  </div>
</div>
`)

  instance.update(
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input />
    </Field>
  )

  expect(instance).toMatchInlineSnapshot(`
<div>
  <label
    htmlFor=":r0:"
  >
    Label
  </label>
  <input
    id=":r0:"
  />
</div>
`)
})
