import React from 'react'
import { describe, it, expect, beforeEach, jest } from 'bun:test'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createQueryManager } from '../factors/createQueryManager'
import { createTestQueryClient, TestUser, TestUserFilters, createMockUsers, createMockApiFunctions } from './setup'

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Integration Tests', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>
  let mockApi: ReturnType<typeof createMockApiFunctions>
  let queryManager: ReturnType<typeof createQueryManager<TestUser, TestUserFilters>>

  beforeEach(() => {
    queryClient = createTestQueryClient()
    mockApi = createMockApiFunctions()

    queryManager = createQueryManager<TestUser, TestUserFilters>({
      name: 'users',
      queryClient,
      listFn: mockApi.listFn,
      retrieveFn: mockApi.retrieveFn,
      createFn: mockApi.createFn,
      updateFn: mockApi.updateFn,
      deleteFn: mockApi.deleteFn,
      listLimit: 5
    })
  })

  describe('Complete CRUD Workflow', () => {
    it('should handle complete user lifecycle', async () => {
      // Start with some existing users
      const initialUsers = createMockUsers(3)
      mockApi.setUsers(initialUsers)

      // 1. Load initial list
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      expect(listResult.current.items).toHaveLength(3)

      // 2. Retrieve specific user
      const targetUser = listResult.current.items[0]
      const { result: retrieveResult } = renderHook(
        () => queryManager.useRetrieve(targetUser.id),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(retrieveResult.current.query.isSuccess).toBe(true)
      })

      expect(retrieveResult.current.item).toEqual(targetUser)

      // 3. Create new user
      const { result: createResult } = renderHook(
        () => queryManager.useCreate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      act(() => {
        createResult.current.mutate({
          name: 'New User',
          email: 'new@example.com',
          status: 'active'
        })
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
      })

      expect(listResult.current.items).toHaveLength(4)
      expect(listResult.current.items[0].name).toBe('New User')

      // 4. Update existing user
      const { result: updateResult } = renderHook(
        () => queryManager.useUpdate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      act(() => {
        updateResult.current.mutate({
          id: targetUser.id,
          name: 'Updated Name',
          status: 'inactive'
        })
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
      })

      expect(retrieveResult.current.item?.name).toBe('Updated Name')
      expect(retrieveResult.current.item?.status).toBe('inactive')

      // 5. Delete user
      const { result: deleteResult } = renderHook(
        () => queryManager.useDelete({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      const userToDelete = listResult.current.items[1]

      act(() => {
        deleteResult.current.mutate(userToDelete.id)
      })

      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true)
      })

      expect(listResult.current.items).toHaveLength(3)
      expect(listResult.current.items.find(u => u.id === userToDelete.id)).toBeUndefined()
    })
  })

  describe('Pagination and Infinite Scroll', () => {
    beforeEach(() => {
      const manyUsers = createMockUsers(25)
      mockApi.setUsers(manyUsers)
    })

    it('should handle pagination correctly', async () => {
      const { result } = renderHook(
        () => queryManager.useList({ limit: 5 }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      // First page
      expect(result.current.items).toHaveLength(5)
      expect(result.current.query.hasNextPage).toBe(true)

      // Load next page
      act(() => {
        result.current.query.fetchNextPage()
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(10)
      })

      // Load more pages
      act(() => {
        result.current.query.fetchNextPage()
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(15)
      })

      // Continue until all pages loaded
      while (result.current.query.hasNextPage) {
        act(() => {
          result.current.query.fetchNextPage()
        })

        await waitFor(() => {
          expect(result.current.query.isFetchingNextPage).toBe(false)
        })
      }

      expect(result.current.items).toHaveLength(25)
      expect(result.current.query.hasNextPage).toBe(false)
    })

    it('should maintain pagination after mutations', async () => {
      const { result: listResult } = renderHook(
        () => queryManager.useList({ limit: 5 }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      // Load multiple pages
      act(() => {
        listResult.current.query.fetchNextPage()
      })

      await waitFor(() => {
        expect(listResult.current.items).toHaveLength(10)
      })

      // Create new item
      const { result: createResult } = renderHook(
        () => queryManager.useCreate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      act(() => {
        createResult.current.mutate({
          name: 'Paginated New User',
          email: 'paginated@example.com',
          status: 'active'
        })
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
      })

      // Should maintain pagination structure
      expect(listResult.current.items).toHaveLength(11) // +1 new item
      expect(listResult.current.items[0].name).toBe('Paginated New User')
    })
  })

  describe('Filtering and Search', () => {
    beforeEach(() => {
      const users = [
        ...createMockUsers(5).map(u => ({ ...u, status: 'active' as const })),
        ...createMockUsers(3).map(u => ({ ...u, status: 'inactive' as const }))
      ]
      mockApi.setUsers(users)
    })

    it('should filter list results correctly', async () => {
      const { result: activeResult } = renderHook(
        () => queryManager.useList({ filters: { status: 'active' } }),
        { wrapper: createWrapper(queryClient) }
      )

      const { result: inactiveResult } = renderHook(
        () => queryManager.useList({ filters: { status: 'inactive' } }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(activeResult.current.query.isSuccess).toBe(true)
        expect(inactiveResult.current.query.isSuccess).toBe(true)
      })

      expect(activeResult.current.items).toHaveLength(5)
      expect(inactiveResult.current.items).toHaveLength(3)
      expect(activeResult.current.items.every(u => u.status === 'active')).toBe(true)
      expect(inactiveResult.current.items.every(u => u.status === 'inactive')).toBe(true)
    })

    it('should handle mutations with filtered lists', async () => {
      const { result: activeListResult } = renderHook(
        () => queryManager.useList({ filters: { status: 'active' } }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(activeListResult.current.query.isSuccess).toBe(true)
      })

      // Create with matching filter
      const { result: createResult } = renderHook(
        () => queryManager.useCreate({
          optimistic: true,
          listFilters: { status: 'active' }
        }),
        { wrapper: createWrapper(queryClient) }
      )

      act(() => {
        createResult.current.mutate({
          name: 'New Active User',
          email: 'active@example.com',
          status: 'active'
        })
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
      })

      expect(activeListResult.current.items).toHaveLength(6)
      expect(activeListResult.current.items[0].name).toBe('New Active User')
    })

    it('should handle search filtering', async () => {
      const users = createMockUsers(10).map((user, index) => ({
        ...user,
        name: index % 2 === 0 ? `John ${index}` : `Jane ${index}`,
        email: index % 2 === 0 ? `john${index}@example.com` : `jane${index}@example.com`
      }))
      mockApi.setUsers(users)

      const { result } = renderHook(
        () => queryManager.useList({ filters: { search: 'John' } }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.items.every(u => u.name.includes('John'))).toBe(true)
    })
  })

  describe('Cache Synchronization', () => {
    beforeEach(() => {
      const users = createMockUsers(10)
      mockApi.setUsers(users)
    })

    it('should keep list and retrieve caches synchronized', async () => {
      // Load list first
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const targetUser = listResult.current.items[2]

      // Load specific user
      const { result: retrieveResult } = renderHook(
        () => queryManager.useRetrieve(targetUser.id),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(retrieveResult.current.query.isSuccess).toBe(true)
      })

      // Update the user through retrieve cache
      const { result: updateResult } = renderHook(
        () => queryManager.useUpdate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      act(() => {
        updateResult.current.mutate({
          id: targetUser.id,
          name: 'Synchronized Update'
        })
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
      })

      // Both caches should reflect the change
      expect(retrieveResult.current.item?.name).toBe('Synchronized Update')
      expect(listResult.current.items.find(u => u.id === targetUser.id)?.name).toBe('Synchronized Update')
    })

    it('should handle multiple filtered lists correctly', async () => {
      const users = [
        { id: '1', name: 'Active User 1', email: 'a1@test.com', status: 'active' as const, createdAt: '2024-01-01' },
        { id: '2', name: 'Active User 2', email: 'a2@test.com', status: 'active' as const, createdAt: '2024-01-02' },
        { id: '3', name: 'Inactive User', email: 'i1@test.com', status: 'inactive' as const, createdAt: '2024-01-03' }
      ]
      mockApi.setUsers(users)

      // Load different filtered lists
      const { result: allListResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      const { result: activeListResult } = renderHook(
        () => queryManager.useList({ filters: { status: 'active' } }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(allListResult.current.query.isSuccess).toBe(true)
        expect(activeListResult.current.query.isSuccess).toBe(true)
      })

      // Update a user
      const { result: updateResult } = renderHook(
        () => queryManager.useUpdate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      act(() => {
        updateResult.current.mutate({
          id: '1',
          status: 'inactive'
        })
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
      })

      // All lists should be updated
      const updatedUserInAll = allListResult.current.items.find(u => u.id === '1')
      const updatedUserInActive = activeListResult.current.items.find(u => u.id === '1')

      expect(updatedUserInAll?.status).toBe('inactive')
      expect(updatedUserInActive?.status).toBe('inactive')
    })
  })

  describe('Performance and Memory', () => {
    it('should handle large datasets efficiently', async () => {
      // Create a large dataset
      const largeDataset = createMockUsers(1000)
      mockApi.setUsers(largeDataset)

      const { result } = renderHook(
        () => queryManager.useList({ limit: 50 }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      // Should load only the requested amount
      expect(result.current.items).toHaveLength(50)

      // Load next page efficiently
      const startTime = performance.now()

      act(() => {
        result.current.query.fetchNextPage()
      })

      await waitFor(() => {
        expect(result.current.items).toHaveLength(100)
      })

      const endTime = performance.now()
      const loadTime = endTime - startTime

      // Should be reasonably fast (less than 100ms)
      expect(loadTime).toBeLessThan(100)
    })

    it('should properly clean up resources', async () => {
      const { result, unmount } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      // Unmount component
      unmount()

      // Query should still be in cache but can be garbage collected
      expect(queryClient.getQueryCache().getAll()).toHaveLength(1)
    })
  })

  describe('Real-world Scenarios', () => {
    it('should handle concurrent user sessions', async () => {
      const users = createMockUsers(5)
      mockApi.setUsers(users)

      // Simulate two different user sessions
      const queryClient1 = createTestQueryClient()
      const queryClient2 = createTestQueryClient()

      const queryManager1 = createQueryManager<TestUser, TestUserFilters>({
        name: 'users',
        queryClient: queryClient1,
        listFn: mockApi.listFn,
        retrieveFn: mockApi.retrieveFn,
        createFn: mockApi.createFn,
        updateFn: mockApi.updateFn,
        deleteFn: mockApi.deleteFn
      })

      const queryManager2 = createQueryManager<TestUser, TestUserFilters>({
        name: 'users',
        queryClient: queryClient2,
        listFn: mockApi.listFn,
        retrieveFn: mockApi.retrieveFn,
        createFn: mockApi.createFn,
        updateFn: mockApi.updateFn,
        deleteFn: mockApi.deleteFn
      })

      // Load data in both sessions
      const { result: session1Result } = renderHook(
        () => queryManager1.useList(),
        { wrapper: createWrapper(queryClient1) }
      )

      const { result: session2Result } = renderHook(
        () => queryManager2.useList(),
        { wrapper: createWrapper(queryClient2) }
      )

      await waitFor(() => {
        expect(session1Result.current.query.isSuccess).toBe(true)
        expect(session2Result.current.query.isSuccess).toBe(true)
      })

      // Both sessions should have independent caches
      expect(session1Result.current.items).toEqual(session2Result.current.items)

      // Create in session 1
      const { result: createResult } = renderHook(
        () => queryManager1.useCreate({ optimistic: true }),
        { wrapper: createWrapper(queryClient1) }
      )

      act(() => {
        createResult.current.mutate({
          name: 'Session 1 User',
          email: 'session1@example.com',
          status: 'active'
        })
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
      })

      // Session 1 should see the new user
      expect(session1Result.current.items.some(u => u.name === 'Session 1 User')).toBe(true)

      // Session 2 should not see it until refetch
      expect(session2Result.current.items.some(u => u.name === 'Session 1 User')).toBe(false)

      // Refetch in session 2
      act(() => {
        session2Result.current.query.refetch()
      })

      await waitFor(() => {
        expect(session2Result.current.items.some(u => u.name === 'Session 1 User')).toBe(true)
      })
    })
  })
})
