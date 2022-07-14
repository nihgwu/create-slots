# create-slots

Bring slots to React component, with SSR support

## Usage

1. Define your component with slots

```jsx
import * as React from 'react'
import createSlots from 'create-slots'

const { createHostComponent, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description: 'p',
})

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const id = React.useId()
  const inputId = Slots.getProps('Input').id || `${id}-label`
  const descriptionId = `${id}-desc`

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
  createHostComponent(FieldBase),
  SlotComponents
)
Field.displayName = 'Field'
```

2. Use it

```jsx
<Field>
  <Field.Input />
  <Field.Label>Label</Field.Label>
  <Field.Description>Description</Field.Description>
</Field>
```

### List slots

```jsx
import React, { useState } from 'react'
import createSlots from 'create-slots/list'

const { createHostComponent, SlotComponents, useSlots } = createSlots({
  Item: 'li',
  Divider: 'hr',
})

const SelectBase: React.FC<React.ComponentPropsWithoutRef<'ul'>> = (props) => {
  const [selected, setSelected] = useState < React.ReactNode > null
  const slotItems = useSlots().renderItems(
    ({ name, props: itemProps, index }) => {
      if (name === 'Item') {
        return {
          ...itemProps,
          'data-index': index,
          'aria-selected': itemProps.children === selected,
          onClick: () => {
            setSelected(itemProps.value)
          },
        }
      }
    }
  )

  return (
    <div>
      <div>Selected: {selected}</div>
      <ul {...props}>{slotItems}</ul>
    </div>
  )
}

export const Select = Object.assign(
  createHostComponent(SelectBase),
  SlotComponents
)
```
