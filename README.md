# create-slots

Bring slots to React components, with SSR support

🧩 Compose with confidence  
🤖 Inversion of Control  
🤞 A11y support in ease  
🎨 Server Side Rendering  
🍀 StrictMode compliant
💪 Best TypeScript support  
🪶 Lightweight (< 700B)

## Usage

1. Create your component with slots

```tsx
import React, { useId } from 'react'
import createSlots from 'create-slots'

const { createHost, SlotComponents, useSlots } = createSlots({
  Label: 'label',
  Input: 'input',
  Description: 'div',
})

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const id = useId()
  const inputId = Slots.getProps('Input')?.id || `${id}-label`
  const descriptionId = Slots.has('Description') ? `${id}-desc` : undefined

  return (
    <div {...props}>
      {Slots.render('Label', { htmlFor: inputId })}
      {Slots.render('Input', {
        id: inputId,
        'aria-describedby': descriptionId,
      })}
      {Slots.render('Description', { id: descriptionId })}
    </div>
  )
}

export const Field = Object.assign(createHost(FieldBase), SlotComponents)
```

2. Use it

```tsx
<Field>
  <Field.Description>Order doesn't matter</Field.Description>
  <Field.Input id="custom-id" />
  <Field.Label>I'll use "custom-id"</Field.Label>
</Field>
```

### List slots

```tsx
import React, { useState } from 'react'
import createSlots from 'create-slots/list'

const { createHost, SlotComponents, useSlots } = createSlots({
  Item: 'li',
  Divider: 'hr',
})

const SelectBase: React.FC<React.ComponentPropsWithoutRef<'ul'>> = (props) => {
  const [selected, setSelected] = useState<React.ReactNode>(null)
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

export const Select = Object.assign(createHost(SelectBase), SlotComponents)
```

## License

MIT © [Neo Nie](https://github.com/nihgwu)
