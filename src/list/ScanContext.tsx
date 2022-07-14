import * as React from 'react'

// istanbul ignore next
export const ScanContext = React.createContext({ rescan: () => {} })

export const ScanProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, rescan] = React.useReducer(() => [], [])

  const value = React.useMemo(
    () => ({ rescan }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )
  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>
}
