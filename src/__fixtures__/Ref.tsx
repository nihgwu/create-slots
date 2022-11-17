import * as React from 'react'

export const RefProvider = <T extends HTMLElement>({
  children,
}: {
  children: (ref: React.RefObject<T>) => JSX.Element
}) => {
  const ref = React.useRef<T | null>(null)
  return children(ref)
}

export const RefConsumer = <T extends HTMLElement>({
  targetRef,
  children,
}: {
  targetRef: React.RefObject<T>
  children: (ref: T | null) => JSX.Element
}) => {
  const [target, setTarget] = React.useState<T | null>(null)
  React.useEffect(() => setTarget(targetRef.current), [targetRef])

  return children(target)
}
