import * as React from 'react'
import { screen, fireEvent } from '@testing-library/react'

import { create, render, setNodeEnv } from '../__fixtures__/utils'
import { Select } from '../__fixtures__/Select'
import { RefProvider, RefConsumer } from '../__fixtures__/Ref'

test('render slots', () => {
  const instance = create(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <div>
        Selected: 
      </div>
      <ul>
        <li
          aria-selected={false}
          data-index={0}
          onClick={[Function]}
          role="option"
          value="foo"
        >
          Foo
        </li>
        <hr />
        <li
          aria-selected={false}
          data-index={1}
          onClick={[Function]}
          role="option"
          value="bar"
        >
          Bar
        </li>
      </ul>
    </div>
  `)

  // insert item
  instance.update(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      <Select.Divider />
      <Select.Item value="baz">Baz</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <div>
        Selected: 
      </div>
      <ul>
        <li
          aria-selected={false}
          data-index={0}
          onClick={[Function]}
          role="option"
          value="foo"
        >
          Foo
        </li>
        <hr />
        <li
          aria-selected={false}
          data-index={1}
          onClick={[Function]}
          role="option"
          value="baz"
        >
          Baz
        </li>
        <hr />
        <li
          aria-selected={false}
          data-index={2}
          onClick={[Function]}
          role="option"
          value="bar"
        >
          Bar
        </li>
      </ul>
    </div>
  `)

  // remove item
  instance.update(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <div>
        Selected: 
      </div>
      <ul>
        <li
          aria-selected={false}
          data-index={0}
          onClick={[Function]}
          role="option"
          value="foo"
        >
          Foo
        </li>
        <hr />
        <li
          aria-selected={false}
          data-index={1}
          onClick={[Function]}
          role="option"
          value="bar"
        >
          Bar
        </li>
      </ul>
    </div>
  `)

  // update item
  instance.update(
    <Select>
      <Select.Item value="foo">FooFoo</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )
  expect(instance).toMatchInlineSnapshot(`
    <div>
      <div>
        Selected: 
      </div>
      <ul>
        <li
          aria-selected={false}
          data-index={0}
          onClick={[Function]}
          role="option"
          value="foo"
        >
          FooFoo
        </li>
        <hr />
        <li
          aria-selected={false}
          data-index={1}
          onClick={[Function]}
          role="option"
          value="bar"
        >
          Bar
        </li>
      </ul>
    </div>
  `)

  // nested slots
  instance.update(
    <Select>
      <Select.Item value="foo">
        <Select>
          <Select.Item value="foo">FooFoo</Select.Item>
          <Select.Divider />
          <Select.Item value="bar">Bar</Select.Item>
        </Select>
      </Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )

  expect(instance).toMatchInlineSnapshot(`
    <div>
      <div>
        Selected: 
      </div>
      <ul>
        <li
          aria-selected={false}
          data-index={0}
          onClick={[Function]}
          role="option"
          value="foo"
        >
          <div>
            <div>
              Selected: 
            </div>
            <ul>
              <li
                aria-selected={false}
                data-index={0}
                onClick={[Function]}
                role="option"
                value="foo"
              >
                FooFoo
              </li>
              <hr />
              <li
                aria-selected={false}
                data-index={1}
                onClick={[Function]}
                role="option"
                value="bar"
              >
                Bar
              </li>
            </ul>
          </div>
        </li>
        <hr />
        <li
          aria-selected={false}
          data-index={1}
          onClick={[Function]}
          role="option"
          value="bar"
        >
          Bar
        </li>
      </ul>
    </div>
  `)
})

test('static hoisting', () => {
  expect(Select.Divider.foo).toBe('Foo')
})

test('ref', () => {
  const ref = { current: null }
  render(
    <Select>
      <Select.Item ref={ref} value="foo">
        Foo
      </Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )

  expect(ref.current).toMatchInlineSnapshot(`
    <li
      aria-selected="false"
      data-index="0"
      role="option"
      value="foo"
    >
      Foo
    </li>
  `)
})

test('interaction', () => {
  render(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      <Select.Divider />
      <Select.Item value="bar">Bar</Select.Item>
    </Select>
  )

  fireEvent.click(screen.getAllByRole('option')[0])
  expect(screen.getByText('Selected: foo')).not.toBeNull()

  fireEvent.click(screen.getAllByRole('option')[1])
  expect(screen.getByText('Selected: bar')).not.toBeNull()
})

test('dev warning', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation()
  render(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      Divider
    </Select>
  )
  expect(warn).toHaveBeenCalledTimes(1)
  expect(warn).toHaveBeenCalledWith(
    'Unwrapped children found in "HostSlots", either wrap them in slots or remove'
  )

  const restoreNodeEnv = setNodeEnv('production')

  render(
    <Select>
      <Select.Item value="foo">Foo</Select.Item>
      Divider
    </Select>
  )
  expect(warn).toHaveBeenCalledTimes(1)

  restoreNodeEnv()
})

test('attaching ref', () => {
  const callback = jest.fn()
  render(
    <Select>
      <RefProvider<HTMLLIElement>>
        {(ref) => (
          <>
            <Select.Item ref={ref} value="foo">
              Foo
            </Select.Item>
            <RefConsumer targetRef={ref}>{callback}</RefConsumer>
          </>
        )}
      </RefProvider>
    </Select>
  )

  expect(callback).toHaveBeenLastCalledWith(expect.any(HTMLLIElement))
})
