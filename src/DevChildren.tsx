import React, { useEffect, useRef } from 'react'

type DevChildrenProps = {
  name: string
  children: React.ReactNode
}

export const DevChildren = ({ name, children }: DevChildrenProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const warnedRef = useRef(false)
  useEffect(() => {
    if (!warnedRef.current && ref.current?.innerHTML) {
      console.warn(
        `Unwrapped children found in "${name}", either wrap them in subcomponents or remove`
      )
    }
    warnedRef.current = true
  }, [name])

  return <span ref={ref}>{children}</span>
}
