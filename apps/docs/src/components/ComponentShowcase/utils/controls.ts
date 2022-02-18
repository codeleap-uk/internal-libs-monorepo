export const stateFromControls = (controls) => {
  const state = {}

  Object.entries(controls).forEach(([name, initialValue]) => {
    let value = initialValue

    switch (typeof initialValue) {
      case 'object':
        if (Array.isArray(initialValue)) {
          break
        } else {
          value = Object.values(initialValue)[0]
        }
      default:
        break
    }

    state[name] = value
  })

  return state
}
