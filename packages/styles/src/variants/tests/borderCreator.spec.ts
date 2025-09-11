import { describe, expect, test, beforeEach } from 'bun:test'
import { borderCreator } from '../borderCreator'
import { mockTheme } from '../../tests/theme'

describe('borderCreator', () => {
  beforeEach(() => {
    mockTheme()
  })

  test('should create border with default parameters', () => {
    const result = borderCreator({ color: '#007bff' })

    expect(result).toEqual({
      borderTopColor: '#007bff',
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderRightColor: '#007bff',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderBottomColor: '#007bff',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderLeftColor: '#007bff',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid'
    })
  })

  test('should create border with custom width', () => {
    const result = borderCreator({
      color: '#6c757d',
      width: 2
    })

    expect(result).toEqual({
      borderTopColor: '#6c757d',
      borderTopWidth: 2,
      borderTopStyle: 'solid',
      borderRightColor: '#6c757d',
      borderRightWidth: 2,
      borderRightStyle: 'solid',
      borderBottomColor: '#6c757d',
      borderBottomWidth: 2,
      borderBottomStyle: 'solid',
      borderLeftColor: '#6c757d',
      borderLeftWidth: 2,
      borderLeftStyle: 'solid'
    })
  })

  test('should create border with custom style', () => {
    const result = borderCreator({
      color: '#28a745',
      style: 'dashed'
    })

    expect(result).toEqual({
      borderTopColor: '#28a745',
      borderTopWidth: 1,
      borderTopStyle: 'dashed',
      borderRightColor: '#28a745',
      borderRightWidth: 1,
      borderRightStyle: 'dashed',
      borderBottomColor: '#28a745',
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderLeftColor: '#28a745',
      borderLeftWidth: 1,
      borderLeftStyle: 'dashed'
    })
  })

  test('should create border for specific directions', () => {
    const result = borderCreator({
      color: '#dc3545',
      directions: ['top', 'bottom']
    })

    expect(result).toEqual({
      borderTopColor: '#dc3545',
      borderTopWidth: 1,
      borderTopStyle: 'solid',
      borderBottomColor: '#dc3545',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid'
    })

    const leftResult = borderCreator({
      color: '#ffc107',
      directions: ['left']
    })

    expect(leftResult).toEqual({
      borderLeftColor: '#ffc107',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid'
    })
  })

  test('should handle string width values', () => {
    const result = borderCreator({
      color: '#17a2b8',
      width: '2px'
    })

    expect(result).toEqual({
      borderTopColor: '#17a2b8',
      borderTopWidth: '2px',
      borderTopStyle: 'solid',
      borderRightColor: '#17a2b8',
      borderRightWidth: '2px',
      borderRightStyle: 'solid',
      borderBottomColor: '#17a2b8',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderLeftColor: '#17a2b8',
      borderLeftWidth: '2px',
      borderLeftStyle: 'solid'
    })
  })

  test('should handle custom color strings (not from theme)', () => {
    const result = borderCreator({
      color: '#ff0000',
      width: 3
    })

    expect(result).toEqual({
      borderTopColor: '#ff0000',
      borderTopWidth: 3,
      borderTopStyle: 'solid',
      borderRightColor: '#ff0000',
      borderRightWidth: 3,
      borderRightStyle: 'solid',
      borderBottomColor: '#ff0000',
      borderBottomWidth: 3,
      borderBottomStyle: 'solid',
      borderLeftColor: '#ff0000',
      borderLeftWidth: 3,
      borderLeftStyle: 'solid'
    })
  })

  test('should handle empty directions array', () => {
    const result = borderCreator({
      color: '#000',
      directions: []
    })

    expect(result).toEqual({})
  })

  test('should handle single direction', () => {
    const result = borderCreator({
      color: '#f8f9fa',
      directions: ['right']
    })

    expect(result).toEqual({
      borderRightColor: '#f8f9fa',
      borderRightWidth: 1,
      borderRightStyle: 'solid'
    })
  })

  test('should handle all border directions individually', () => {
    const directions = ['top', 'right', 'bottom', 'left'] as const

    directions.forEach(direction => {
      const result = borderCreator({
        color: 'primary',
        directions: [direction]
      })

      expect(result).toHaveProperty(`border${direction.charAt(0).toUpperCase() + direction.slice(1)}Color`)
      expect(result).toHaveProperty(`border${direction.charAt(0).toUpperCase() + direction.slice(1)}Width`)
      expect(result).toHaveProperty(`border${direction.charAt(0).toUpperCase() + direction.slice(1)}Style`)
    })
  })
})
