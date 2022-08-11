import * as React from 'react'

import { createSlotsContext, getComponentName } from '../utils'
import { ScanContext, ScanProvider } from '../ScanContext'
import { createSlotsManager } from './SlotsManager'

export * from '../utils'

type Slots = ReturnType<typeof createSlotsManager>
type Callback = (Slots: React.ReactElement[]) => JSX.Element | null

const SlotsContext = createSlotsContext<Slots | undefined>(undefined)

const Template = ({ children }: { children: () => ReturnType<Callback> }) => {
  return children()
}

const createIdGenerator = (prefix = '') => {
  let id = 0
  return () => `${prefix}_${id++}`
}

const genSlotId = createIdGenerator('s')

export const Host = ({
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
        <ScanProvider>{children}</ScanProvider>
      </SlotsContext.Provider>
      <Template>{() => callback(Slots.get())}</Template>
    </>
  )
}

export const createHost = (children: React.ReactNode, callback: Callback) => {
  return <Host children={children} callback={callback} />
}

export const createSlot = <T extends React.ElementType>(Fallback?: T) => {
  const genId = createIdGenerator(genSlotId())

  const Slot = React.forwardRef(
    ({ $slot_key$: key, ...props }: any, ref: any) => {
      const Slots = React.useContext(SlotsContext)
      if (!Slots) return null
      /* eslint-disable react-hooks/rules-of-hooks */
      const Scan = React.useContext(ScanContext)

      const element = <SlotWithKey key={key} ref={ref} {...props} />
      Slots.register(key, element)
      React.useEffect(() => {
        Slots.has(key) && Slots.update(key, element)
      })
      React.useEffect(() => {
        Slots.clear()
        Scan.rescan()
        return () => Slots.unmount(key)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [Slots])
      /* eslint-enable react-hooks/rules-of-hooks */

      return null
    }
  ) as unknown as T

  // provide stable key in StrictMode
  const ForwardRef = (props: any, ref: any) => {
    const Slots = React.useContext(SlotsContext)
    if (!Slots) return Fallback ? <Fallback ref={ref} {...props} /> : null

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [key] = React.useState(genId)
    return <Slot ref={ref} $slot_key$={key} {...props} />
  }
  ForwardRef.displayName = Fallback
    ? `Slot(${getComponentName(Fallback)})`
    : 'Slot'
  const SlotWithKey = React.forwardRef(ForwardRef) as unknown as T

  return SlotWithKey
}
