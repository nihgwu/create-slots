import * as React from 'react'

import { createHost, createSlot } from '../simple'

const Description = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} />
)

const FieldLabel = createSlot<'label'>()
const FieldInput = createSlot('input')
const FieldDescription = createSlot(Description)
const FieldIcon = createSlot('span')

// const createFill = <P extends keyof typeof SlotComponents>(name: P) => {
//   const FillComponent = React.forwardRef((props, ref) => {
//     const Slots = useSlots()
//     const [originalProps] = React.useState(() => Slots.getProps(name))

//     React.useEffect(() => Slots.update(name, { ...props, ref }))
//     React.useEffect(
//       () => () => {
//         originalProps ? Slots.update(name, originalProps) : Slots.unmount(name)
//       },
//       [Slots, originalProps]
//     )

//     return null
//   }) as unknown as typeof SlotComponents[P]
//   return FillComponent
// }

type FieldProps = React.ComponentPropsWithoutRef<'div'>

export const Field = (props: FieldProps) => {
  const id = ':r0:'
  const descriptionId = ':r1:'

  return createHost(props.children, (Slots) => {
    const labelProps = Slots.getProps(FieldLabel)
    const inputProps = Slots.getProps(FieldInput)
    const descriptionProps = Slots.getProps(FieldDescription)
    const iconProps = Slots.getProps(FieldIcon)
    return (
      <div {...props}>
        {labelProps && <label {...labelProps} htmlFor={inputProps?.id || id} />}
        {inputProps && (
          <input
            id={id}
            aria-describedby={descriptionProps ? descriptionId : undefined}
            {...inputProps}
          />
        )}
        {(iconProps || descriptionProps) && (
          <div>
            {Slots.get(FieldIcon)}
            {descriptionProps && (
              <span {...descriptionProps} id={descriptionId} />
            )}
          </div>
        )}
      </div>
    )
  })
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Description = FieldDescription
Field.Icon = FieldIcon
