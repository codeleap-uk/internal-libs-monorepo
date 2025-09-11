import { describe, it, expect, beforeEach } from 'bun:test'
import { createStyles } from '../createStyles'
import { themeStore } from '../../theme'
import { mockTheme, MockedTheme } from '../../tests/theme'

describe('createStyles', () => {
  let currentTheme: MockedTheme = null

  beforeEach(() => {
    mockTheme()

    currentTheme = themeStore.theme as unknown as MockedTheme
  })

  it('should return static styles when provided as object', () => {
    const staticStyles = {
      button: { color: 'red', padding: '10px' },
      input: { border: '1px solid gray' }
    }

    const styles = createStyles(staticStyles)

    expect(styles.button).toEqual({ color: 'red', padding: '10px' })
    expect(styles.input).toEqual({ border: '1px solid gray' })
  })

  it('should handle empty static styles object', () => {
    const styles = createStyles({})
    expect(Object.keys(styles)).toHaveLength(0)
  })

  it('should compute styles from function when theme is available', () => {
    const functionStyles = (theme: MockedTheme) => ({
      button: {
        color: theme.colors.neutralSo,
        backgroundColor: theme.colors.secondary
      },
      container: {
        padding: theme.spacing.value(2)
      }
    })

    const styles = createStyles(functionStyles)

    expect(styles.button).toEqual({
      color: currentTheme.colors.neutralSo,
      backgroundColor: currentTheme.colors.secondary
    })
    expect(styles.container).toEqual({
      padding: 16
    })
  })

  it('should recompute styles when theme changes (proxy behavior)', () => {
    const functionStyles = (theme: MockedTheme) => ({
      button: { color: theme.colors.buttonRegularPrimaryBgDefault }
    })

    const styles = createStyles(functionStyles)

    // Initial theme
    expect(styles.button).toEqual({ color: currentTheme.colors.primarySolid800 })

    currentTheme.setColorScheme('dark')

    // Should reflect new theme due to proxy
    expect(styles.button).toEqual({ color: currentTheme.colors.primarySolid500 })
  })

  it('should handle complex theme-based styles', () => {
    const functionStyles = (theme: MockedTheme) => ({
      button: {
        color: theme.colors.redSolid100,
        border: `1px solid ${theme.colors.neutralSolid1000}`,
        '@media (max-width: 768px)': {
          fontSize: '14px'
        }
      },
      alert: {
        backgroundColor: theme.colors.redSolid600
      }
    })

    const styles = createStyles(functionStyles)

    expect(styles.button).toEqual({
      color: currentTheme.colors.redSolid100,
      border: `1px solid ${currentTheme.colors.neutralSolid1000}`,
      '@media (max-width: 768px)': {
        fontSize: '14px'
      }
    })
    expect(styles.alert).toEqual({
      backgroundColor: currentTheme.colors.redSolid600
    })
  })

  it('should handle accessing non-existent properties', () => {
    const staticStyles = {
      button: { color: 'red' }
    } as any

    const styles = createStyles(staticStyles)

    expect(styles.nonExistent).toBeUndefined()
  })

  it('should work with mixed ICSS and custom properties', () => {
    const functionStyles = (theme: MockedTheme) => ({
      component: {
        // ICSS properties
        color: theme.colors.blueSolid900,
        padding: '10px',
        // Custom properties (merged with ICSS)
        customProp: 'custom-value',
        dataAttribute: 'test'
      }
    })

    const styles = createStyles(functionStyles)

    expect(styles.component).toEqual({
      color: currentTheme.colors.blueSolid900,
      padding: '10px',
      customProp: 'custom-value',
      dataAttribute: 'test'
    })
  })

  it('should maintain proxy behavior across multiple accesses', () => {
    let computeCount = 0

    const functionStyles = (theme: MockedTheme) => {
      computeCount++
      return {
        button: { color: theme.colors.blueSolid100 }
      }
    }

    const styles = createStyles(functionStyles)

    computeCount = 0

    // Each property access should trigger recomputation
    styles.button
    styles.button
    styles.button

    expect(computeCount).toBe(3)
  })
})
