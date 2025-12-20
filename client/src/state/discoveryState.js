let discoveryState = null

export const getDiscoveryState = () => discoveryState

export const setDiscoveryState = (next) => {
  // Keep a defensive clone so callers can't mutate the stored reference.
  try {
    discoveryState = next ? JSON.parse(JSON.stringify(next)) : null
  } catch {
    discoveryState = null
  }
}

export const clearDiscoveryState = () => {
  discoveryState = null
}


