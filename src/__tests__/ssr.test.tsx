/**
 * @jest-environment node
 */

import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Field } from '../__fixtures__/Field'
import { StaticField } from '../__fixtures__/StaticField'
import { Select } from '../__fixtures__/Select'

test('default SSR', () => {
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

  expect(markup).toMatchInlineSnapshot(`"<div><label for=\\"input-id\\">Label</label><input id=\\"input-id\\" aria-describedby=\\":r1:\\"/><div><span id=\\":r1:\\"><div><label for=\\":r0:\\">Label</label><input id=\\":r0:\\"/></div></span></div></div>"`)

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
})

test('static SSR', () => {
  const markup = renderToStaticMarkup(
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

  expect(markup).toMatchInlineSnapshot(`"<div><label for=\\"input-id\\">Label</label><input id=\\"input-id\\" aria-describedby=\\":r1:\\"/><div><span id=\\":r1:\\"><div><label for=\\":r0:\\">Label</label><input id=\\":r0:\\"/></div></span></div></div>"`)

  // arbitrary order
  const markup1 = renderToStaticMarkup(
    <StaticField>
      <StaticField.Description>
        <StaticField>
          <StaticField.Label>Label</StaticField.Label>
          <StaticField.Input />
        </StaticField>
      </StaticField.Description>
      <StaticField.Label>Label</StaticField.Label>
      <StaticField.Input id="input-id" />
    </StaticField>
  )

  expect(markup1).toEqual(markup)
})

test('list SSR', () => {
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
})
