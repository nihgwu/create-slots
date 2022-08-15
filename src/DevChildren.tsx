import React, { useEffect, useRef, useState } from 'react'

type DevChildrenProps = {
  name: string
  children: React.ReactNode
}

export const DevChildren = ({ name, children }: DevChildrenProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [warned, setWarned] = useState(false)

  useEffect(() => {
    if (!warned && ref.current?.innerHTML) {
      console.warn(
        `Unwrapped children found in "${name}", either wrap them in slots or remove`
      )
    }
    setWarned(true)
  }, [name, warned])

  return warned ? (children as JSX.Element) : <span ref={ref}>{children}</span>
}
