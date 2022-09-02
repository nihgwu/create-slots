import * as React from 'react'

import { useIsomorphicEffect } from './utils'

const Wrapper = 'slots-wrapper' as 'span'
const wrapperRegexp = new RegExp(`^<${Wrapper}>.*</${Wrapper}>$`)

type DevChildrenProps = {
  name: string
  children: React.ReactNode
}

export const DevChildren = ({ name, children }: DevChildrenProps) => {
  const ref = React.useRef<HTMLSpanElement>(null)
  const warnedRef = React.useRef(false)
  const forceUpdate = React.useReducer(() => [], [])[1]

  useIsomorphicEffect(() => {
    if (!warnedRef.current && ref.current?.innerHTML) {
      const content = ref.current.innerHTML
      if (content && !wrapperRegexp.test(content)) {
        console.warn(
          `Unwrapped children found in "${name}", either wrap them in slots or remove`
        )
      }
    }
    warnedRef.current = true
    forceUpdate()
  }, [name])

  return warnedRef.current ? (
    <>{children}</>
  ) : (
    <Wrapper ref={ref}>{children}</Wrapper>
  )
}
