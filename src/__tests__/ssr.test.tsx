/**
 * @jest-environment node
 */

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Field } from '../__fixtures__/Field'
import { Select } from '../__fixtures__/Select'

test('default SSR', () => {
  const NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'

  const markup = renderToStaticMarkup(
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

  expect(markup).toMatchInlineSnapshot(
    `"<div><label for=\\"input-id\\">Label</label><input id=\\"input-id\\" aria-describedby=\\":r1:\\"/><div><span id=\\":r1:\\"><div><label for=\\":r0:\\">Label</label><input id=\\":r0:\\"/></div></span></div></div>"`
  )

  // arbitrary order
  const markup1 = renderToStaticMarkup(
    <Field>
      <Field.Description>
        <Field>
          <Field.Label>Label</Field.Label>
          <Field.Input />
        </Field>
      </Field.Description>
      <Field.Label>Label</Field.Label>
      <Field.Input id="input-id" />
    </Field>
  )

  expect(markup1).toEqual(markup)

  process.env.NODE_ENV = NODE_ENV
})

test('list SSR', () => {
  const NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = 'production'

  const markup = renderToStaticMarkup(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )
  expect(markup).toMatchInlineSnapshot(
    `"<div><div>Selected: </div><ul><li value=\\"foo\\" data-index=\\"0\\" aria-selected=\\"false\\">Foo</li><hr/><li value=\\"bar\\" data-index=\\"1\\" aria-selected=\\"false\\">Bar</li></ul></div>"`
  )

  process.env.NODE_ENV = NODE_ENV
})

test('default SSR - development', () => {
  const markup = renderToStaticMarkup(
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

  expect(markup).toMatchInlineSnapshot(
    `"<slots-wrapper></slots-wrapper><div><label for=\\"input-id\\">Label</label><input id=\\"input-id\\" aria-describedby=\\":r1:\\"/><div><span id=\\":r1:\\"><slots-wrapper></slots-wrapper><div><label for=\\":r0:\\">Label</label><input id=\\":r0:\\"/></div></span></div></div>"`
  )
})

test('list SSR - development', () => {
  const markup = renderToStaticMarkup(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )
  expect(markup).toMatchInlineSnapshot(
    `"<div><div>Selected: </div><slots-wrapper></slots-wrapper><ul><li value=\\"foo\\" data-index=\\"0\\" aria-selected=\\"false\\">Foo</li><hr/><li value=\\"bar\\" data-index=\\"1\\" aria-selected=\\"false\\">Bar</li></ul></div>"`
  )
})
