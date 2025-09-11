import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'bun:test'
import { useCompositionStyles } from '../useCompositionStyles'
import { getNestedStylesByKey } from '../../utils'

describe('useCompositionStyles', () => {
  const mockComponentStyles = {
    button: {
      backgroundColor: 'blue',
      color: 'white',
      padding: '10px'
    },
    input: {
      border: '1px solid gray',
      padding: '5px'
    },
    container: {
      display: 'flex',
      gap: '10px'
    }
  }

  it('should return styles for single element', () => {
    const { result } = renderHook(() =>
      useCompositionStyles('button', mockComponentStyles)
    )

    expect(result.current).toEqual({
      button: getNestedStylesByKey('button', mockComponentStyles)
    })
  })

  it('should return styles for array of elements', () => {
    const composition = ['button', 'input']
    
    const { result } = renderHook(() =>
      useCompositionStyles(composition, mockComponentStyles)
    )

    expect(result.current).toEqual({
      button: getNestedStylesByKey('button', mockComponentStyles),
      input: getNestedStylesByKey('input', mockComponentStyles)
    })
  })

  it('should handle empty array', () => {
    const { result } = renderHook(() =>
      useCompositionStyles([], mockComponentStyles)
    )

    expect(result.current).toEqual({})
  })

  it('should memoize results with same props', () => {
    const { result, rerender } = renderHook(
      ({ composition, styles }) => useCompositionStyles(composition, styles),
      {
        initialProps: {
          composition: 'button',
          styles: mockComponentStyles
        }
      }
    )

    const firstResult = result.current
    rerender({ composition: 'button', styles: mockComponentStyles })
    expect(result.current).toEqual(firstResult)
  })

  it('should update when composition changes', () => {
    const { result, rerender } = renderHook(
      ({ composition }) => useCompositionStyles(composition, mockComponentStyles),
      {
        initialProps: { composition: 'button' }
      }
    )

    expect(result.current).toEqual({
      button: getNestedStylesByKey('button', mockComponentStyles)
    })

    rerender({ composition: 'input' })
    expect(result.current).toEqual({
      input: getNestedStylesByKey('input', mockComponentStyles)
    })
  })

  it('should handle non-existent keys', () => {
    const { result } = renderHook(() =>
      useCompositionStyles('nonexistent', mockComponentStyles)
    )

    expect(result.current).toEqual({
      nonexistent: getNestedStylesByKey('nonexistent', mockComponentStyles)
    })
  })

  it('should preserve original componentStyles object', () => {
    const originalStyles = { ...mockComponentStyles }
    
    renderHook(() =>
      useCompositionStyles('button', mockComponentStyles)
    )

    expect(mockComponentStyles).toEqual(originalStyles)
  })
})
