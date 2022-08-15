import * as React from 'react'

import { createHost, createSlot } from '../simple'

const Description = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} />
)

const FieldLabel = createSlot<'label'>()
const FieldInput = createSlot('input')
const FieldDescription = createSlot(Description)
const FieldIcon = createSlot('span')

type Slots = Parameters<Parameters<typeof createHost>[1]>[0]
const FillContext = React.createContext<Slots | undefined>(undefined)

const createFill = <T extends React.ElementType>(Slot: T) => {
  const FillComponent = React.forwardRef((props: any, ref) => {
    const Slots = React.useContext(FillContext)!
    const [original] = React.useState(() => Slots.get(Slot))

    React.useEffect(() => Slots.update(Slot, <Slot ref={ref} {...props} />))
    React.useEffect(
      () => () => {
        original ? Slots.update(Slot, original) : Slots.unmount(Slot)
      },
      [Slots, original]
    )

    return null
  }) as unknown as T
  return FillComponent
}

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
      <FillContext.Provider value={Slots}>
        <div {...props}>
          {labelProps && (
            <label {...labelProps} htmlFor={inputProps?.id || id} />
          )}
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
      </FillContext.Provider>
    )
  })
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Description = FieldDescription
Field.Icon = FieldIcon
Field.LabelFill = createFill(FieldLabel)
