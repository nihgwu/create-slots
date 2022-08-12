import * as React from 'react'

import { createHost, createSlot, getSlot, getLastSlot, getSlots } from '../rfc'

const Description = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} />
)

const FieldLabel = createSlot<'label'>()
const FieldInput = createSlot('input')
const FieldDescription = createSlot(Description)
const FieldIcon = createSlot('span')

type FieldProps = React.ComponentPropsWithoutRef<'div'>

export const Field = (props: FieldProps) => {
  return createHost(props.children, (slots) => {
    const labelSlot = getSlot(slots, FieldLabel)
    const lastLabelSlot = getLastSlot(slots, FieldLabel)
    const inputSlot = getSlot(slots, FieldInput)
    const lastInputSlot = getLastSlot(slots, FieldInput)
    const lastDescriptionSlot = getLastSlot(slots, FieldDescription)
    const icons = getSlots(slots, FieldIcon)
    return (
      <div {...props}>
        {lastLabelSlot && <label {...lastLabelSlot.props} />}
        {lastInputSlot && <input {...lastInputSlot.props} />}
        {lastDescriptionSlot}
        {icons}
        {labelSlot}
        {inputSlot}
      </div>
    )
  })
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Description = FieldDescription
Field.Icon = FieldIcon
