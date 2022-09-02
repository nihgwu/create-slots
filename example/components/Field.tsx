import React, { useId, useState } from 'react'
import { createHost, createSlot } from 'create-slots'

const Description = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div
    {...props}
    style={{ borderLeft: '4px solid lightgray', paddingLeft: 4 }}
  />
)

const FieldLabel = createSlot('label')
const FieldInput = createSlot('input')
const FieldDescription = createSlot(Description)

export const Field = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const id = useId()

  return (
    <div {...props}>
      {createHost(props.children, (Slots) => {
        const labelProps = Slots.getProps(FieldLabel)
        const inputProps = Slots.getProps(FieldInput)
        const descriptionIdProps = Slots.getProps(FieldDescription)

        const inputId = inputProps?.id || `${id}-label`
        const descriptionId = descriptionIdProps ? `${id}-desc` : undefined

        return (
          <>
            {labelProps && <label {...labelProps} htmlFor={inputId} />}
            {inputProps && (
              <input
                id={inputId}
                aria-describedby={descriptionId}
                {...inputProps}
              />
            )}
            {descriptionIdProps && (
              <Description id={descriptionId} {...descriptionIdProps} />
            )}
          </>
        )
      })}
    </div>
  )
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Description = FieldDescription
