import * as React from 'react'

import { create, render, setNodeEnv } from '../__fixtures__/utils'
import { Field } from '../__fixtures__/Field'
import { RefProvider, RefConsumer } from '../__fixtures__/Ref'

test('render slots', () => {
  const instance = create(
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input />
      <Field.Icon>-</Field.Icon>
      <Field.Description>Description</Field.Description>
    </Field>
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
    <Field>
      <Field.Icon>-</Field.Icon>
      <Field.Input />
      <Field.Description>Description</Field.Description>
      <Field.Label>Label</Field.Label>
    </Field>
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
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input id="input-id" />
    </Field>
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
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input id="input-id" />
      <Field.Description>
        <Field>
          <Field.Label>Label</Field.Label>
          <Field.Input />
        </Field>
      </Field.Description>
    </Field>
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
  // filling slots
  instance.update(
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input id="input-id" />
      <Field.Description>
        Description
        <Field.LabelFill>Filled Label</Field.LabelFill>
      </Field.Description>
    </Field>
  )

  expect(instance).toMatchInlineSnapshot(`
    <div>
      <label
        htmlFor="input-id"
      >
        Filled Label
      </label>
      <input
        aria-describedby=":r1:"
        id="input-id"
      />
      <div>
        <span
          id=":r1:"
        >
          Description
        </span>
      </div>
    </div>
  `)

  // unmount filling slots
  instance.update(
    <Field>
      <Field.Label>Label</Field.Label>
      <Field.Input id="input-id" />
      <Field.Description>Description</Field.Description>
    </Field>
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
          Description
        </span>
      </div>
    </div>
  `)
})

test('static hoisting', () => {
  expect(Field.Description.foo).toBe('Foo')
})

test('ref', () => {
  const ref = { current: null }
  render(
    <Field>
      <Field.Label ref={ref}>Label</Field.Label>
      <Field.Input />
      <Field.Icon>-</Field.Icon>
      <Field.Description>Description</Field.Description>
    </Field>
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
    <Field>
      <Field.Label>Label</Field.Label>
      Input
    </Field>
  )
  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn).toHaveBeenCalledWith(
    'Unwrapped children found in "HostSlots", either wrap them in slots or remove'
  )

  const restoreNodeEnv = setNodeEnv('production')

  render(
    <Field>
      <Field.Label>Label</Field.Label>
      Input
    </Field>
  )
  expect(warn).toHaveBeenCalledTimes(1)

  restoreNodeEnv()
})

test('without host', () => {
  const instance = create(<Field.Label>Label</Field.Label>)
  expect(instance).toMatchInlineSnapshot(`null`)

  instance.update(<Field.Description>Description</Field.Description>)
  expect(instance).toMatchInlineSnapshot(`
    <span
      data-testid="description"
    >
      Description
    </span>
  `)
})

test('attaching ref', () => {
  const callback = jest.fn()
  render(
    <Field>
      <RefProvider<HTMLLabelElement>>
        {(ref) => (
          <>
            <Field.Label ref={ref}>Label</Field.Label>
            <RefConsumer targetRef={ref}>{callback}</RefConsumer>
          </>
        )}
      </RefProvider>
    </Field>
  )

  expect(callback).toHaveBeenLastCalledWith(expect.any(HTMLLabelElement))
})
