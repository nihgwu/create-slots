import React, { useId, useState } from 'react'
import { createHost, createSlot } from 'create-slots/simple'

const Description = (props: React.ComponentPropsWithoutRef<'div'>) => (
  <div
    {...props}
    style={{ borderLeft: '4px solid lightgray', paddingLeft: 4 }}
  />
)

const FieldLabel = createSlot('label')
const FieldInput = createSlot('input')
const FieldDescription = createSlot(Description)

const StyledLabel = (props: React.ComponentPropsWithoutRef<'label'>) => (
  <FieldLabel {...props} style={{ color: 'red' }} />
)

export const Field = (props: React.ComponentPropsWithoutRef<'div'>) => {
  const id = useId()
  const [value, setValue] = useState('')

  if (value === 'a') return null

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
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
Field.StyledLabel = StyledLabel
