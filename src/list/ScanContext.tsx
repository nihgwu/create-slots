import React, { createContext, useReducer, useMemo } from 'react'

// istanbul ignore next
export const ScanContext = createContext({ rescan: () => {} })

export const ScanProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, rescan] = useReducer(() => [], [])

  const value = useMemo(
    () => ({ rescan }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state]
  )
  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>
}
