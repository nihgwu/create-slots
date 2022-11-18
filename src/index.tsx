import * as React from 'react'

import { createSlotsContext, getComponentName, hoistStatics } from './utils'
import { DevChildren } from './DevChildren'
import { createSlotsManager } from './SlotsManager'

type Slots = ReturnType<typeof createSlotsManager>
type Callback = (Slots: Slots) => JSX.Element | null

const SlotsContext = createSlotsContext<Slots | undefined>(undefined)

const Template = ({ children }: { children: () => ReturnType<Callback> }) => {
  return children()
}

export const HostSlots = ({
  children,
  callback,
}: {
  children: React.ReactNode
  callback: Callback
}) => {
  const forceUpdate = React.useReducer(() => [], [])[1]
  const Slots = React.useMemo(
    () => createSlotsManager(forceUpdate),
    [forceUpdate]
  )

  return (
    <>
      <SlotsContext.Provider value={Slots}>
        {process.env.NODE_ENV === 'production' ? (
          children
        ) : (
          <DevChildren name="HostSlots" forceUpdate={forceUpdate}>
            {children}
          </DevChildren>
        )}
      </SlotsContext.Provider>
      <Template>{() => callback(Slots)}</Template>
    </>
  )
}

export const createHost = (children: React.ReactNode, callback: Callback) => {
  return <HostSlots children={children} callback={callback} />
}

export const createSlot = <T extends React.ElementType>(Fallback?: T) => {
  const ForwardRef = (props: any, ref: any) => {
    const Slots = React.useContext(SlotsContext)
    if (!Slots) return Fallback ? <Fallback ref={ref} {...props} /> : null

    const element = <Slot ref={ref} {...props} />
    /* eslint-disable react-hooks/rules-of-hooks */
    React.useState(() => Slots.register(Slot, element))
    React.useEffect(() => Slots.update(Slot, element))
    React.useEffect(() => () => Slots.unmount(Slot), [Slots])
    /* eslint-enable react-hooks/rules-of-hooks */

    return null
  }
  ForwardRef.displayName = Fallback
    ? `Slot(${getComponentName(Fallback)})`
    : 'Slot'
  const Slot = React.forwardRef(ForwardRef) as unknown as T

  return Fallback ? hoistStatics(Slot, Fallback) : Slot
}
