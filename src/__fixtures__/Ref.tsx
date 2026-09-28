import * as React from 'react'

export const RefProvider = <T extends HTMLElement>({
  children,
}: {
  children: (ref: React.RefObject<T>) => React.ReactElement
}) => {
  const ref = React.useRef<T>(null as unknown as T)
  return children(ref)
}

export const RefConsumer = <T extends HTMLElement>({
  targetRef,
  children,
}: {
  targetRef: React.RefObject<T>
  children: (ref: T | null) => React.ReactElement
}) => {
  const [target, setTarget] = React.useState<T | null>(null)
  React.useEffect(() => setTarget(targetRef.current), [targetRef])

  return children(target)
}
