/**
 * Deep merge constructor from Fastify's optimized implementation.
 * Returns a merge function that recursively merges objects with high performance.
 * By default, arrays are concatenated and objects are deeply merged.
 * 
 * @example
 * const merger = deepmerge()
 * const result = merger(target, source)
 */
export { default as deepmerge } from '@fastify/deepmerge'