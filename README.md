# create-slots

Bring slots to React component, with SSR support

## Usage

1. Define your component with slots

```jsx
import * as React from 'react'
import createSlots from 'create-slots'

const { createHostComponnet, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description: 'p',
})

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const inputId = React.useId()
  const descriptionId = React.useId()

  return (
    <div {...props}>
      {Slots.render('Label', { htmlFor: inputId })}
      {Slots.render('Input', {
        id: inputId,
        'aria-describedby': Slots.has('Description')
          ? descriptionId
          : undefined,
      })}
      {Slots.render('Description', { id: descriptionId })}
    </div>
  )
}

export const Field = Object.assign(
  createHostComponnet(FieldBase),
  SlotComponents
)
Field.displayName = 'Field'
```

2. Use it

```jsx
<Field>
  <Field.Input />
  <Field.Label>Field Label</Field.Label>
  <Field.Description>Field Description</Field.Description>
</Field>
```
