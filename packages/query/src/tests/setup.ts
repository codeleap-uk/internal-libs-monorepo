import { afterEach, beforeEach } from 'bun:test'
import { QueryClient } from '@tanstack/react-query'
import { cleanup } from '@testing-library/react'

export interface TestUser {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface TestUserFilters {
  status?: 'active' | 'inactive'
  search?: string
}

export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export const createMockUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: `user-${Date.now()}-${Math.random()}`,
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active',
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createMockUsers = (count: number): TestUser[] => {
  return Array.from({ length: count }, (_, i) => createMockUser({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))
}

export const createMockApiFunctions = () => {
  const users: TestUser[] = []

  return {
    listFn: async (limit: number, offset: number, filters?: TestUserFilters) => {
      let filteredUsers = [...users]

      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status)
      }

      if (filters?.search) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search!.toLowerCase())
        )
      }

      return filteredUsers.slice(offset, offset + limit)
    },

    retrieveFn: async (id: string) => {
      const user = users.find(u => u.id === id)
      if (!user) throw new Error('User not found')
      return user
    },

    createFn: async (data: Partial<TestUser>) => {
      const newUser: TestUser = {
        id: `user-${users?.length + 1}`,
        name: data.name || 'New User',
        email: data.email || 'new@example.com',
        status: data.status || 'active',
        createdAt: new Date().toISOString(),
      }
      users.push(newUser)
      return newUser
    },

    updateFn: async (data: Partial<TestUser>) => {
      const userIndex = users.findIndex(u => u.id === data.id)
      if (userIndex === -1) throw new Error('User not found')

      users[userIndex] = { ...users[userIndex], ...data }
      return users[userIndex]
    },

    deleteFn: async (id: string) => {
      const userIndex = users.findIndex(u => u.id === id)
      if (userIndex === -1) throw new Error('User not found')

      users.splice(userIndex, 1)
      return id
    },

    getUsersArray: () => [...users],
    addUser: (user: TestUser) => users.push(user),
    clearUsers: () => users.splice(0, users.length),
    setUsers: (newUsers: TestUser[]) => {
      users.splice(0, users.length, ...newUsers)
    }
  }
}

beforeEach(() => { })

afterEach(() => {
  cleanup()
})

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
