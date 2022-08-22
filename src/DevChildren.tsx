import React, { useEffect, useRef, useReducer } from 'react'

const Wrapper = 'slots-wrapper' as 'span'
const wrapperRegexp = new RegExp(`^<${Wrapper}>.*</${Wrapper}>$`)

type DevChildrenProps = {
  name: string
  children: React.ReactNode
}

export const DevChildren = ({ name, children }: DevChildrenProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const warnedRef = useRef(false)
  const forceUpdate = useReducer(() => [], [])[1]

  useEffect(() => {
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
