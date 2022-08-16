import * as React from 'react'

import { create, render } from '../__fixtures__/utils'
import { StaticField } from '../__fixtures__/StaticField'

test('render slots', () => {
  const instance = create(
    <StaticField>
      <StaticField.Label>Label</StaticField.Label>
      <StaticField.Input />
      <StaticField.Icon>-</StaticField.Icon>
      <StaticField.Description>Description</StaticField.Description>
    </StaticField>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <label
        htmlFor=":r0:"
      >
        Label
      </label>
      <input
        aria-describedby=":r1:"
        id=":r0:"
      />
      <div>
        <span>
          -
        </span>
        <span
          id=":r1:"
        >
          Description
        </span>
      </div>
    </div>
  `)

  // arbitrary order
  instance.update(
    <StaticField>
      <StaticField.Icon>-</StaticField.Icon>
      <StaticField.Input />
      <StaticField.Description>Description</StaticField.Description>
      <StaticField.Label>Label</StaticField.Label>
    </StaticField>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <label
        htmlFor=":r0:"
      >
        Label
      </label>
      <input
        aria-describedby=":r1:"
        id=":r0:"
      />
      <div>
        <span>
          -
        </span>
        <span
          id=":r1:"
        >
          Description
        </span>
      </div>
    </div>
  `)

  // dynamic content
  instance.update(
    <StaticField>
      <StaticField.Label>Label</StaticField.Label>
      <StaticField.Input id="input-id" />
    </StaticField>
  )

  expect(instance).toMatchInlineSnapshot(`
    <div>
      <label
        htmlFor="input-id"
      >
        Label
      </label>
      <input
        id="input-id"
      />
    </div>
  `)

  // nested slots
  instance.update(
    <StaticField>
      <StaticField.Label>Label</StaticField.Label>
      <StaticField.Input id="input-id" />
      <StaticField.Description>
        <StaticField>
          <StaticField.Label>Label</StaticField.Label>
          <StaticField.Input />
        </StaticField>
      </StaticField.Description>
    </StaticField>
  )

  expect(instance).toMatchInlineSnapshot(`
    <div>
      <label
        htmlFor="input-id"
      >
        Label
      </label>
      <input
        aria-describedby=":r1:"
        id="input-id"
      />
      <div>
        <span
          id=":r1:"
        >
          <div>
            <label
              htmlFor=":r0:"
            >
              Label
            </label>
            <input
              id=":r0:"
            />
          </div>
        </span>
      </div>
    </div>
  `)
})

test('static hoisting', () => {
  expect(StaticField.Description.foo).toBe('Foo')
})

test('ref', () => {
  const ref = { current: null }
  render(
    <StaticField>
      <StaticField.Label ref={ref}>Label</StaticField.Label>
      <StaticField.Input />
      <StaticField.Icon>-</StaticField.Icon>
      <StaticField.Description>Description</StaticField.Description>
    </StaticField>
  )

  expect(ref.current).toMatchInlineSnapshot(`
<label
  for=":r0:"
>
  Label
</label>
`)
})

test('dev warning', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation()
  render(
    <StaticField>
      <StaticField.Label>Label</StaticField.Label>
      Input
    </StaticField>
  )
  expect(warn).toHaveBeenCalledTimes(0)

  // @ts-ignore
  process.env.NODE_ENV = 'development'
  render(
    <StaticField>
      <StaticField.Label>Label</StaticField.Label>
      Input
    </StaticField>
  )
  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn).toHaveBeenCalledWith(
    'Unwrapped children found in "Host(FieldBase)", either wrap them in slots or remove'
  )
})
