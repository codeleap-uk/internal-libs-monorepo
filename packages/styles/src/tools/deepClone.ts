import rfdc from 'rfdc'

/**
 * Creates a deep clone of any JavaScript object or value.
 * Uses rfdc (Really Fast Deep Clone) for optimal performance.
 * 
 * @param {T} obj - The object or value to clone
 * @returns {T} A deep copy of the input
 */
export const deepClone = rfdc()