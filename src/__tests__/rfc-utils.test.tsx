import * as React from 'react'

import { create } from '../__fixtures__/utils'
import { Field } from '../__fixtures__/RFCField'

test('render slots', () => {
  const instance = create(
    <Field>
      <Field.Input value="Input 1" />
      <Field.Input value="Input 2" />
      <Field.Label>Label 1</Field.Label>
      <Field.Label>Label 2</Field.Label>
      <Field.Icon>Icon 1</Field.Icon>
      <Field.Icon>Icon 2</Field.Icon>
    </Field>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <label>
        Label 2
      </label>
      <input
        value="Input 2"
      />
      <span>
        Icon 1
      </span>
      <span>
        Icon 2
      </span>
      <input
        value="Input 1"
      />
    </div>
  `)
})
