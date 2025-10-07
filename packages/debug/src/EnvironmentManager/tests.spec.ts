import { describe, test, expect, beforeEach } from 'bun:test'
import { createEnvironmentManager } from './factor'
import { EnvironmentManager } from './class'
import { EDITORS } from './const'

type TestEnvironments = {
  development: string
  staging: string
  production: string
  custom: string
}

describe('EnvironmentManager', () => {
  let manager: EnvironmentManager<TestEnvironments>

  const envs = {
    development: 'http://localhost:3000/',
    staging: 'https://staging.example.com/',
    production: 'https://api.example.com/',
    custom: '',
  }

  const testConfig = {
    environments: envs,
    defaultEnvironment: 'development' as const,
    customEnvironment: 'custom' as const,
    persistKey: 'test-env-manager',
  }

  beforeEach(() => {
    manager = createEnvironmentManager<TestEnvironments>(testConfig)
  })

  describe('Initialization', () => {
    test('should create instance with correct config', () => {
      expect(manager).toBeInstanceOf(EnvironmentManager)
      expect(manager.environments).toEqual(testConfig.environments)
      expect(manager.editors).toEqual(EDITORS)
    })

    test('should have correct default config', () => {
      expect(manager.defaultConfig).toEqual({
        environment: 'development',
        customUrl: '',
        enabledBy: null,
      })
    })
  })

  describe('URL Validation', () => {
    test('should validate correct HTTP URLs', () => {
      expect(manager.testUrl(envs.development)).toBe(true)
      expect(manager.testUrl('http://example.com/')).toBe(true)
      expect(manager.testUrl('http://192.168.1.1:8080/')).toBe(true)
    })

    test('should validate correct HTTPS URLs', () => {
      expect(manager.testUrl('https://example.com/')).toBe(true)
      expect(manager.testUrl(envs.production)).toBe(true)
      expect(manager.testUrl('https://sub.domain.example.com:443/')).toBe(true)
    })

    test('should reject invalid URLs', () => {
      expect(manager.testUrl('ftp://example.com/')).toBe(false)
      expect(manager.testUrl('http://example.com')).toBe(false)
      expect(manager.testUrl('example.com/')).toBe(false)
      expect(manager.testUrl('http:/example.com/')).toBe(false)
      expect(manager.testUrl('')).toBe(false)
    })
  })

  describe('Enable/Disable functionality', () => {
    test('should start disabled by default', () => {
      expect(manager.isEnabled).toBe(false)
      expect(manager.isEnabledBy).toBeNull()
    })

    test('should enable by user', () => {
      const result = manager.setEnabled(EDITORS.USER)
      expect(result).toBe(true)
      expect(manager.isEnabled).toBe(true)
      expect(manager.isEnabledByUser).toBe(true)
      expect(manager.isEnabledBySystem).toBe(false)
    })

    test('should enable by system', () => {
      manager.setEnabled(EDITORS.SYSTEM)
      expect(manager.isEnabled).toBe(true)
      expect(manager.isEnabledBySystem).toBe(true)
      expect(manager.isEnabledByUser).toBe(false)
    })

    test('should disable when setting null', () => {
      manager.setEnabled(EDITORS.USER)
      expect(manager.isEnabled).toBe(true)

      const result = manager.setEnabled(null)
      expect(result).toBe(false)
      expect(manager.isEnabled).toBe(false)
    })
  })

  describe('Environment management', () => {
    beforeEach(() => {
      manager.setEnabled(EDITORS.USER)
    })

    test('should return default environment when disabled', () => {
      manager.setEnabled(null)
      const env = manager.env
      expect(env.environment).toBe('development')
    })

    test('should set environment when enabled', () => {
      manager.setEnvironment('staging')
      const env = manager.env
      expect(env.environment).toBe('staging')
    })

    test('should not set environment when disabled', () => {
      manager.setEnabled(null)
      manager.setEnvironment('production')
      expect(manager.isEnvironment('development')).toBe(true)
    })

    test('should check current environment correctly', () => {
      manager.setEnvironment('production')
      expect(manager.isEnvironment('production')).toBe(true)
      expect(manager.isEnvironment('staging')).toBe(false)
    })
  })

  describe('Environment checker (is)', () => {
    beforeEach(() => {
      manager.setEnabled(EDITORS.USER)
    })

    test('should have correct environment flags for development', () => {
      manager.setEnvironment('development')
      expect(manager.is.Development).toBe(true)
      expect(manager.is.Staging).toBe(false)
      expect(manager.is.Production).toBe(false)
    })

    test('should have correct environment flags for production', () => {
      manager.setEnvironment('production')
      expect(manager.is.Production).toBe(true)
      expect(manager.is.Development).toBe(false)
      expect(manager.is.Staging).toBe(false)
    })

    test('should have correct environment flags for staging', () => {
      manager.setEnvironment('staging')
      expect(manager.is.Staging).toBe(true)
      expect(manager.is.Development).toBe(false)
      expect(manager.is.Production).toBe(false)
    })
  })

  describe('Server URL', () => {
    beforeEach(() => {
      manager.setEnabled(EDITORS.USER)
    })

    test('should return correct URL for each environment', () => {
      manager.setEnvironment('development')
      expect(manager.serverUrl).toBe(envs.development)

      manager.setEnvironment('staging')
      expect(manager.serverUrl).toBe(envs.staging)

      manager.setEnvironment('production')
      expect(manager.serverUrl).toBe(envs.production)
    })

    test('should return default URL when disabled', () => {
      manager.setEnabled(null)
      expect(manager.serverUrl).toBe(envs.development)
    })

    test('should return custom URL when set and valid', () => {
      manager.setCustomUrl('https://custom.example.com/')
      manager.setEnvironment('custom')
      expect(manager.serverUrl).toBe('https://custom.example.com/')
    })
  })

  describe('Custom URL', () => {
    beforeEach(() => {
      manager.setEnabled(EDITORS.USER)
    })

    test('should set valid custom URL', () => {
      manager.setCustomUrl('https://custom.example.com/')
      manager.setEnvironment('custom')
      expect(manager.serverUrl).toBe('https://custom.example.com/')
    })

    test('should add trailing slash if missing', () => {
      manager.setCustomUrl('https://custom.example.com')
      manager.setEnvironment('custom')
      expect(manager.serverUrl).toBe('https://custom.example.com/')
    })

    test('should not set invalid custom URL', () => {
      const initialUrl = manager.env.customUrl
      manager.setCustomUrl('invalid-url')
      expect(manager.env.customUrl).toBe(initialUrl)
    })

    test('should handle localhost custom URLs', () => {
      manager.setCustomUrl('http://localhost:4000/')
      manager.setEnvironment('custom')
      expect(manager.serverUrl).toBe('http://localhost:4000/')
    })

    test('should handle IP address custom URLs', () => {
      manager.setCustomUrl('http://192.168.1.100:8080/')
      manager.setEnvironment('custom')
      expect(manager.serverUrl).toBe('http://192.168.1.100:8080/')
    })
  })

  describe('Factory function', () => {
    test('should create manager instance', () => {
      const newManager = createEnvironmentManager<TestEnvironments>(testConfig)
      expect(newManager).toBeInstanceOf(EnvironmentManager)
    })

    test('should create independent instances', () => {
      const manager1 = createEnvironmentManager<TestEnvironments>({
        ...testConfig,
        persistKey: 'manager-1',
      })
      const manager2 = createEnvironmentManager<TestEnvironments>({
        ...testConfig,
        persistKey: 'manager-2',
      })

      manager1.setEnabled(EDITORS.USER)
      manager1.setEnvironment('production')

      manager2.setEnabled(EDITORS.SYSTEM)
      manager2.setEnvironment('staging')

      expect(manager1.isEnabledByUser).toBe(true)
      expect(manager2.isEnabledBySystem).toBe(true)
    })
  })

  describe('EDITORS constant', () => {
    test('should have correct editor values', () => {
      expect(EDITORS.SYSTEM).toBe('system')
      expect(EDITORS.USER).toBe('user')
    })
  })

  describe('Edge cases', () => {
    test('should handle repeated setEnvironment calls', () => {
      manager.setEnabled(EDITORS.USER)
      manager.setEnvironment('development')
      manager.setEnvironment('staging')
      manager.setEnvironment('production')

      expect(manager.isEnvironment('production')).toBe(true)
    })

    test('should handle empty custom URL', () => {
      manager.setEnabled(EDITORS.USER)
      manager.setCustomUrl('')
      expect(manager.testUrl('')).toBe(false)
    })

    test('should handle switching between enabled states', () => {
      manager.setEnabled(EDITORS.USER)
      expect(manager.isEnabledByUser).toBe(true)

      manager.setEnabled(EDITORS.SYSTEM)
      expect(manager.isEnabledBySystem).toBe(true)
      expect(manager.isEnabledByUser).toBe(false)
    })

    test('should handle multiple custom URL changes', () => {
      manager.setEnabled(EDITORS.USER)

      manager.setCustomUrl('https://custom1.example.com/')
      manager.setEnvironment('custom')
      expect(manager.serverUrl).toBe('https://custom1.example.com/')

      manager.setCustomUrl('https://custom2.example.com/')
      expect(manager.serverUrl).toBe('https://custom2.example.com/')
    })
  })

  describe('Integration tests', () => {
    test('should handle full workflow: enable, set env, get URL', () => {
      manager.setEnabled(null)
      expect(manager.isEnabled).toBe(false)

      manager.setEnabled(EDITORS.USER)
      expect(manager.isEnabled).toBe(true)

      manager.setEnvironment('production')
      expect(manager.isEnvironment('production')).toBe(true)

      expect(manager.serverUrl).toBe(envs.production)
    })

    test('should handle custom URL workflow', () => {
      manager.setEnabled(EDITORS.USER)

      manager.setCustomUrl('https://my-api.example.com/')
      expect(manager.testUrl('https://my-api.example.com/')).toBe(true)

      manager.setEnvironment('custom')
      expect(manager.isEnvironment('custom')).toBe(true)
      expect(manager.serverUrl).toBe('https://my-api.example.com/')
    })

    test('should fallback correctly on invalid custom URL', () => {
      manager.setEnabled(EDITORS.USER)

      manager.setEnvironment('custom')
      manager.setCustomUrl('https://my-api.example.com/')
      manager.setCustomUrl('not-a-valid-url')

      expect(manager.serverUrl).toBe('https://my-api.example.com/')
    })
  })
})
