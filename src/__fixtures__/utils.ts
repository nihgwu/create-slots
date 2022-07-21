import TestRenderer, { act } from 'react-test-renderer'

export const create: typeof TestRenderer.create = (element) => {
  let renderer: TestRenderer.ReactTestRenderer

  TestRenderer.act(() => {
    renderer = TestRenderer.create(element)
    const update = renderer.update
    renderer.update = (element) => {
      act(() => {
        update(element)
      })
    }
  })

  return renderer!
}
