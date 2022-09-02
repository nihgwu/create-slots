import * as React from 'react'

import {
  createHost,
  createSlot,
  getSlot,
  getLastSlot,
  getSlots,
  getSlotProps,
} from '../list'

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
    const lastLabelProps = getSlotProps(getLastSlot(slots, FieldLabel))
    const inputSlot = getSlot(slots, FieldInput)
    const lastInputProps = getSlotProps(getLastSlot(slots, FieldInput))
    const descriptionSlot = getSlot(slots, FieldDescription)
    const lastDescriptionProps = getSlotProps(
      getLastSlot(slots, FieldDescription)
    )
    const icons = getSlots(slots, FieldIcon)
    return (
      <div {...props}>
        {lastLabelProps && <label {...lastLabelProps} />}
        {lastInputProps && <input {...lastInputProps} />}
        {lastDescriptionProps && <Description {...lastDescriptionProps} />}
        {icons}
        {labelSlot}
        {inputSlot}
        {descriptionSlot}
      </div>
    )
  })
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Description = FieldDescription
Field.Icon = FieldIcon
