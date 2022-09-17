import * as React from 'react'
import * as TestRenderer from 'react-test-renderer'
import * as RTL from '@testing-library/react'

export const create: typeof TestRenderer.create = (element) => {
  let renderer: TestRenderer.ReactTestRenderer

  TestRenderer.act(() => {
    renderer = TestRenderer.create(
      <React.StrictMode>{element}</React.StrictMode>
    )
    const update = renderer.update
    renderer.update = (element) => {
      TestRenderer.act(() => {
        update(<React.StrictMode>{element}</React.StrictMode>)
      })
    }
  })

  return renderer!
}

export const render = (element: React.ReactElement) =>
  RTL.render(element, { wrapper: React.StrictMode })

export const setNodeEnv = (env: string) => {
  const NODE_ENV = process.env.NODE_ENV
  process.env.NODE_ENV = env

  return () => {
    process.env.NODE_ENV = NODE_ENV
  }
}
