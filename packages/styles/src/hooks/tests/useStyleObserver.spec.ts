import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'bun:test'
import { useStyleObserver } from '../useStyleObserver'

describe('useStyleObserver', () => {
  it('should return string representation for primitive values', () => {
    const { result } = renderHook(() => useStyleObserver('red'))
    expect(result.current).toBe('red')

    const { result: numberResult } = renderHook(() => useStyleObserver(10))
    expect(numberResult.current).toBe(10)

    const { result: boolResult } = renderHook(() => useStyleObserver(true))
    expect(boolResult.current).toBe(true)
  })

  it('should stringify object styles', () => {
    const style = { color: 'red', fontSize: '14px' }
    const { result } = renderHook(() => useStyleObserver(style))
    
    expect(result.current).toBe(JSON.stringify(style))
  })

  it('should stringify array styles and filter falsy values', () => {
    const style = ['btn', 'btn-primary', null, '', undefined, false]
    const { result } = renderHook(() => useStyleObserver(style))
    
    expect(result.current).toBe(JSON.stringify(['btn', 'btn-primary']))
  })

  it('should handle empty array', () => {
    const { result } = renderHook(() => useStyleObserver([]))
    expect(result.current).toBe(JSON.stringify([]))
  })

  it('should handle array with all falsy values', () => {
    const { result } = renderHook(() => useStyleObserver([null, '', undefined, false]))
    expect(result.current).toBe(JSON.stringify([]))
  })

  it('should handle null and undefined', () => {
    const { result: nullResult } = renderHook(() => useStyleObserver(null))
    expect(nullResult.current).toBe(JSON.stringify(null))

    const { result: undefinedResult } = renderHook(() => useStyleObserver(undefined))
    expect(undefinedResult.current).toBe(undefined)
  })

  it('should memoize results with same input', () => {
    const style = { color: 'blue' }
    const { result, rerender } = renderHook(
      ({ styleInput }) => useStyleObserver(styleInput),
      { initialProps: { styleInput: style } }
    )

    const firstResult = result.current
    rerender({ styleInput: style })
    expect(result.current).toBe(firstResult)
  })

  it('should update when style changes', () => {
    const { result, rerender } = renderHook(
      ({ style }) => useStyleObserver(style),
      { initialProps: { style: { color: 'red' } } }
    )

    expect(result.current).toBe(JSON.stringify({ color: 'red' }))

    rerender({ style: { color: 'blue' } })
    expect(result.current).toBe(JSON.stringify({ color: 'blue' }))
  })

  it('should handle nested objects', () => {
    const style = { 
      button: { color: 'red' }, 
      container: { padding: '10px' } 
    }
    const { result } = renderHook(() => useStyleObserver(style))
    
    expect(result.current).toBe(JSON.stringify(style))
  })

  it('should handle mixed array with objects and strings', () => {
    const style = ['btn', { active: true }, null, 'primary']
    const { result } = renderHook(() => useStyleObserver(style))
    
    expect(result.current).toBe(JSON.stringify(['btn', { active: true }, 'primary']))
  })
})
