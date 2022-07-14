import * as React from 'react'

type ScanContextValue = {
  finished: React.MutableRefObject<boolean>
  rescan: () => void
}

export const ScanContext = React.createContext({} as ScanContextValue)

export const ScanProvider = ({ children }: { children: React.ReactNode }) => {
  const finished = React.useRef(false)
  const [state, rescan] = React.useReducer(() => {
    finished.current = false
    return []
  }, [])

  const value = React.useMemo<ScanContextValue>(
    () => ({ finished, rescan }),
    [state]
  )
  React.useEffect(() => {
    finished.current = true
    return () => {
      finished.current = false
    }
  }, [state])

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>
}
