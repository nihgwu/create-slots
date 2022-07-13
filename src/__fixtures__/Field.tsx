import * as React from 'react'

import createSlots from '..'

const Description = (props: React.ComponentPropsWithoutRef<'span'>) => (
  <span {...props} />
)

const { SlotsContext, createHostComponent, SlotComponents, useSlots } =
  createSlots({
    Label: 'label',
    Input: 'input',
    Description: Object.assign(Description, { foo: 'Foo' }),
    Icon: 'span',
  })

const createFillComponent = <P extends keyof typeof SlotComponents>(
  name: P
) => {
  const FillComponent = React.memo(
    React.forwardRef((props, ref) => {
      const Slots = React.useContext(SlotsContext)
      const [originalProps] = React.useState(() => Slots.getProps(name))

      React.useLayoutEffect(() => Slots.update(name, { ...props, ref }))
      React.useLayoutEffect(
        () => () => {
          originalProps
            ? Slots.update(name, originalProps)
            : Slots.unmount(name)
        },
        [Slots, originalProps]
      )

      return null
    })
  ) as unknown as typeof SlotComponents[P]
  return FillComponent
}

type FieldProps = React.ComponentPropsWithoutRef<'div'>

const FieldBase: React.FC<FieldProps> = (props) => {
  const Slots = useSlots()
  const id = ':r0:'
  const descriptionId = ':r1:'
  const inputProps = Slots.getProps('Input')

  return (
    <div {...props}>
      {Slots.render('Label', { htmlFor: inputProps?.id || id })}
      {Slots.render('Input', undefined, {
        id,
        'aria-describedby': Slots.has('Description')
          ? descriptionId
          : undefined,
        ...Slots.getProps('Input'),
      })}
      {(Slots.has('Icon') || Slots.has('Description')) && (
        <div>
          {Slots.render('Icon')}
          {Slots.render('Description', { id: descriptionId })}
        </div>
      )}
    </div>
  )
}

export const Field = Object.assign(
  createHostComponent(FieldBase),
  SlotComponents,
  {
    LabelFill: createFillComponent('Label'),
  } as const
)
