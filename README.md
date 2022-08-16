# create-slots

Bring [Slots](https://github.com/reactjs/rfcs/pull/223) to React, with SSR support

🧩 Compose with confidence  
🤖 Inversion of Control  
🤞 A11y support in ease  
🎨 Server Side Rendering  
🍀 StrictMode compliant  
💪 Best TypeScript support  
🪶 Lightweight (< 700B)

## Usage

### Simple version (only one slot is used per slot type)

1. Create your component with slots

```tsx
import React, { useId } from 'react'
import { createHost, createSlot } from 'create-slots'

const FieldLabel = createSlot('label')
const FieldInput = createSlot('input')
const FieldDescription = createSlot('div')

type FieldProps = React.ComponentPropsWithoutRef<'div'>

export const Field = (props: FieldProps) => {
  const id = useId()

  return createHost(props.children, (Slots) => {
    const labelProps = Slots.getProps(FieldLabel)
    const inputProps = Slots.getProps(FieldInput)
    const inputId = inputProps?.id || id

    return (
      <div {...props}>
        {labelProps && <label {...labelProps} htmlFor={inputId} />}
        <input id={id} {...inputProps} />
        {Slots.get('Description')}
      </div>
    )
  })
}

Field.Label = FieldLabel
Field.Input = FieldInput
Field.Description = FieldDescription
```

2. Use it

```tsx
<Field>
  <Field.Description>Order doesn't matter</Field.Description>
  <Field.Input id="custom-id" />
  <Field.Label>I'll use "custom-id"</Field.Label>
</Field>
```

### List slots (fully implemented the [React Slots RFC](https://github.com/reactjs/rfcs/pull/223) with utils)

```tsx
import React, { useState } from 'react'
import { createHost, createSlot, getSlotProps, isSlot } from 'create-slots/list'

const SelectItem = createSlot('li')
const SelectDivider = createSlot('hr')

type SelectProps = React.FC<React.ComponentPropsWithoutRef<'ul'>>

const Select = (props: SelectProps) => {
  const [selected, setSelected] = useState<string>()
  const indexRef = React.useRef(0)

  return (
    <div>
      <div>Selected: {selected ?? ''}</div>
      {createHost(props.children, (slots) => {
        indexRef.current = 0
        return (
          <ul {...props}>
            {slots.map((slot) => {
              if (isSlot(slot, SelectItem)) {
                const slotProps = getSlotProps(slot)
                return (
                  <li
                    {...slotProps}
                    data-index={indexRef.current++}
                    aria-selected={slotProps.value === selected}
                    onClick={() => setSelected(slotProps.value as string)}
                  />
                )
              }

              return slot
            })}
          </ul>
        )
      })}
    </div>
  )
}

Select.Item = SelectItem
Select.Divider = SelectDivider
```

2. Use it

```tsx
<Select>
  <Select.Item value="foo">Foo</Select.Item>
  <Select.Divider />
  <Select.Item value="bar">Bar</Select.Item>
</Select>
```

## License

MIT © [Neo Nie](https://github.com/nihgwu)
