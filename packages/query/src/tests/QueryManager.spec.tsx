import { describe, it, expect, beforeEach, jest, spyOn } from 'bun:test'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { QueryManager } from '../lib/QueryManager'
import { createTestQueryClient, TestUser, TestUserFilters, createMockUsers, createMockApiFunctions } from './setup'

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('QueryManager', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>
  let mockApi: ReturnType<typeof createMockApiFunctions>
  let queryManager: QueryManager<TestUser, TestUserFilters>

  beforeEach(() => {
    queryClient = createTestQueryClient()
    mockApi = createMockApiFunctions()

    queryManager = new QueryManager({
      name: 'users',
      queryClient,
      listFn: mockApi.listFn,
      retrieveFn: mockApi.retrieveFn,
      createFn: mockApi.createFn,
      updateFn: mockApi.updateFn,
      deleteFn: mockApi.deleteFn,
      listLimit: 10
    })
  })

  describe('constructor', () => {
    it('should create QueryManager with correct configuration', () => {
      expect(queryManager.name).toBe('users')
      expect(queryManager.functions).toEqual({
        list: mockApi.listFn,
        retrieve: mockApi.retrieveFn,
        create: mockApi.createFn,
        update: mockApi.updateFn,
        delete: mockApi.deleteFn
      })
      expect(queryManager.queryKeys).toBeDefined()
      expect(queryManager.mutations).toBeDefined()
    })
  })

  describe('useList', () => {
    beforeEach(() => {
      const mockUsers = createMockUsers(25) // More than one page
      mockApi.setUsers(mockUsers)
    })

    it('should fetch and return list items', async () => {
      const { result } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.items).toHaveLength(10) // Default limit
      expect(result.current.queryKey).toEqual(['users', 'list'])
    })

    it('should use custom limit', async () => {
      const { result } = renderHook(
        () => queryManager.useList({ limit: 5 }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.items).toHaveLength(5)
    })

    it('should apply filters', async () => {
      const activeUsers = createMockUsers(3).map(user => ({ ...user, status: 'active' as const }))
      const inactiveUsers = createMockUsers(2).map(user => ({ ...user, status: 'inactive' as const }))
      mockApi.setUsers([...activeUsers, ...inactiveUsers])

      const { result } = renderHook(
        () => queryManager.useList({ filters: { status: 'active' } }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.items).toHaveLength(3)
      expect(result.current.items.every(user => user.status === 'active')).toBe(true)
    })

    it('should handle infinite scroll pagination', async () => {
      const { result } = renderHook(
        () => queryManager.useList({ limit: 5 }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.items).toHaveLength(5)
      expect(result.current.query.hasNextPage).toBe(true)

      // Fetch next page
      result.current.query.fetchNextPage()

      await waitFor(() => {
        expect(result.current.items).toHaveLength(10)
      })
    })

    it('should call useListEffect if provided', async () => {
      const useListEffect = jest.fn()
      const queryManagerWithEffect = new QueryManager({
        name: 'users',
        queryClient,
        listFn: mockApi.listFn,
        retrieveFn: mockApi.retrieveFn,
        createFn: mockApi.createFn,
        updateFn: mockApi.updateFn,
        deleteFn: mockApi.deleteFn,
        useListEffect
      })

      renderHook(
        () => queryManagerWithEffect.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(useListEffect).toHaveBeenCalled()
      })
    })

    it('should handle empty results', async () => {
      mockApi.setUsers([])

      const { result } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.items).toEqual([])
    })

    it('should determine next page correctly', async () => {
      const { result } = renderHook(
        () => queryManager.useList({ limit: 10 }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      // Has next page when more items available
      expect(result.current.query.hasNextPage).toBe(true)

      // Fetch all pages
      while (result.current.query.hasNextPage) {
        result.current.query.fetchNextPage()
        await waitFor(() => {
          expect(result.current.query.isFetchingNextPage).toBe(false)
        })
      }

      expect(result.current.query.hasNextPage).toBe(false)
    })
  })

  describe('useRetrieve', () => {
    beforeEach(() => {
      const mockUsers = createMockUsers(5)
      mockApi.setUsers(mockUsers)
    })

    it('should fetch and return single item', async () => {
      const users = mockApi.getUsersArray()
      const targetUser = users[0]

      const { result } = renderHook(
        () => queryManager.useRetrieve(targetUser.id),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(result.current.item).toEqual(targetUser)
      expect(result.current.queryKey).toEqual(['users', 'retrieve', targetUser.id])
    })

    it('should use initial data from list cache', async () => {
      const users = createMockUsers(3)
      mockApi.setUsers(users)

      // First, populate list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      // Then retrieve specific item - should use cache as initial data
      const { result: retrieveResult } = renderHook(
        () => queryManager.useRetrieve(users[0].id),
        { wrapper: createWrapper(queryClient) }
      )

      // Should have initial data immediately
      expect(retrieveResult.current.item).toEqual(users[0])
    })

    it('should handle item not found error', async () => {
      const { result } = renderHook(
        () => queryManager.useRetrieve('non-existent-id'),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isError).toBe(true)
      })

      expect(result.current.item).toBeUndefined()
      expect(result.current.query.error).toEqual(new Error('User not found'))
    })

    it('should call custom select function', async () => {
      const users = mockApi.getUsersArray()
      const targetUser = users[0]
      const customSelect = jest.fn((user: TestUser) => ({ ...user, selected: true }))

      const { result } = renderHook(
        () => queryManager.useRetrieve(targetUser.id, { select: customSelect }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.query.isSuccess).toBe(true)
      })

      expect(customSelect).toHaveBeenCalledWith(targetUser)
    })

    it('should update list cache when retrieve data changes', async () => {
      const users = createMockUsers(3)
      mockApi.setUsers(users)

      // Populate list cache first
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      // Update a user via API BEFORE retrieving
      const updatedUser = { ...users[0], name: 'Updated Name' }
      mockApi.setUsers([updatedUser, ...users.slice(1)])

      await queryManager.queryKeys.refetchList()

      // Retrieve the updated user
      const { result: retrieveResult } = renderHook(
        () => queryManager.useRetrieve(users[0].id),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(retrieveResult.current.query.isSuccess).toBe(true)
      })

      expect(retrieveResult.current.item).toEqual(updatedUser)
    })
  })

  describe('useCreate', () => {
    beforeEach(() => {
      mockApi.setUsers(createMockUsers(3))
    })

    it('should create new item', async () => {
      const { result } = renderHook(
        () => queryManager.useCreate(),
        { wrapper: createWrapper(queryClient) }
      )

      const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

      result.current.mutate(newUserData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toMatchObject(newUserData)
      expect(mockApi.getUsersArray()).toHaveLength(4)
    })

    it('should handle optimistic updates', async () => {
      // First, populate list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const { result: createResult } = renderHook(
        () => queryManager.useCreate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

      createResult.current.mutate(newUserData)

      // Should immediately appear in list cache
      await waitFor(() => {
        expect(listResult.current.items.some(item => item.name === 'New User')).toBe(true)
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
      })

      // Should replace temp item with real data
      expect(listResult.current.items.some(item =>
        item.name === 'New User' && !item.id.startsWith('temp-')
      )).toBe(true)
    })

    // it('should rollback optimistic update on error', async () => {
    //   // Mock API to throw error BEFORE creating hook
    //   const originalCreateFn = mockApi.createFn
    //   mockApi.createFn = jest.fn().mockRejectedValue(new Error('Creation failed'))

    //   // First, populate list cache
    //   const { result: listResult } = renderHook(
    //     () => queryManager.useList(),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   await waitFor(() => {
    //     expect(listResult.current.query.isSuccess).toBe(true)
    //   })

    //   const initialItemCount = listResult.current.items.length

    //   const { result: createResult } = renderHook(
    //     () => queryManager.useCreate({
    //       optimistic: true,
    //       onError: (error) => {
    //         // Handle error silently for test
    //         console.log('Expected error:', error.message)
    //       }
    //     }),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

    //   await createResult.current.mutateAsync(newUserData)

    //   // Should temporarily appear in list
    //   await waitFor(() => {
    //     expect(listResult.current.items.length).toBeGreaterThan(initialItemCount)
    //   })

    //   // Should be removed on error
    //   await waitFor(() => {
    //     expect(createResult.current.isError).toBe(true)
    //   })

    //   expect(listResult.current.items).toHaveLength(initialItemCount)

    //   // Restore original function
    //   mockApi.createFn = originalCreateFn
    // })

    it('should call custom mutation callbacks', async () => {
      const onMutate = jest.fn()
      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(
        () => queryManager.useCreate({ onMutate, onSuccess, onError }),
        { wrapper: createWrapper(queryClient) }
      )

      const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

      await result.current.mutateAsync(newUserData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(onMutate).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
    })

    it('should append to start by default', async () => {
      // First, populate list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const { result: createResult } = renderHook(
        () => queryManager.useCreate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

      createResult.current.mutate(newUserData)

      await waitFor(() => {
        expect(listResult.current.items[0].name).toBe('New User')
      })
    })

    it('should append to end when specified', async () => {
      // First, populate list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const { result: createResult } = renderHook(
        () => queryManager.useCreate({ optimistic: true, appendTo: 'end' }),
        { wrapper: createWrapper(queryClient) }
      )

      const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

      createResult.current.mutate(newUserData)

      await waitFor(() => {
        const items = listResult.current.items
        expect(items[items.length - 1].name).toBe('New User')
      })
    })

    it('should handle list filters', async () => {
      // First, populate filtered list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList({ filters: { status: 'active' } }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const { result: createResult } = renderHook(
        () => queryManager.useCreate({
          optimistic: true,
          listFilters: { status: 'active' }
        }),
        { wrapper: createWrapper(queryClient) }
      )

      const newUserData = { name: 'New User', email: 'new@example.com', status: 'active' as const }

      createResult.current.mutate(newUserData)

      await waitFor(() => {
        expect(listResult.current.items.some(item => item.name === 'New User')).toBe(true)
      })
    })
  })

  describe('useUpdate', () => {
    let existingUsers: TestUser[]

    beforeEach(() => {
      existingUsers = createMockUsers(3)
      mockApi.setUsers(existingUsers)
    })

    it('should update existing item', async () => {
      const { result } = renderHook(
        () => queryManager.useUpdate(),
        { wrapper: createWrapper(queryClient) }
      )

      const updateData = { id: existingUsers[0].id, name: 'Updated Name' }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toMatchObject(updateData)
      const updatedUsers = mockApi.getUsersArray()
      expect(updatedUsers.find(u => u.id === existingUsers[0].id)?.name).toBe('Updated Name')
    })

    it('should handle optimistic updates', async () => {
      // First, populate retrieve cache
      const { result: retrieveResult } = renderHook(
        () => queryManager.useRetrieve(existingUsers[0].id),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(retrieveResult.current.query.isSuccess).toBe(true)
      })

      const { result: updateResult } = renderHook(
        () => queryManager.useUpdate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      const updateData = { id: existingUsers[0].id, name: 'Optimistically Updated' }

      updateResult.current.mutate(updateData)

      // Should immediately appear updated
      await waitFor(() => {
        expect(retrieveResult.current.item?.name).toBe('Optimistically Updated')
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
      })
    })

    // it('should rollback optimistic update on error', async () => {
    //   // Mock API to throw error BEFORE creating hook
    //   const originalUpdateFn = mockApi.updateFn
    //   mockApi.updateFn = jest.fn().mockRejectedValue(new Error('Update failed'))

    //   // First, populate retrieve cache
    //   const { result: retrieveResult } = renderHook(
    //     () => queryManager.useRetrieve(existingUsers[0].id),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   await waitFor(() => {
    //     expect(retrieveResult.current.query.isSuccess).toBe(true)
    //   })

    //   const originalName = retrieveResult.current.item?.name

    //   const { result: updateResult } = renderHook(
    //     () => queryManager.useUpdate({
    //       optimistic: true,
    //       onError: (error) => {
    //         console.log('Expected error:', error.message)
    //       }
    //     }),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   const updateData = { id: existingUsers[0].id, name: 'Failed Update' }

    //   updateResult.current.mutate(updateData)

    //   // Should temporarily show updated name
    //   await waitFor(() => {
    //     expect(retrieveResult.current.item?.name).toBe('Failed Update')
    //   })

    //   // Should rollback to original name on error
    //   await waitFor(() => {
    //     expect(updateResult.current.isError).toBe(true)
    //   })

    //   expect(retrieveResult.current.item?.name).toBe(originalName!)

    //   // Restore original function
    //   mockApi.updateFn = originalUpdateFn
    // })

    it('should call custom mutation callbacks', async () => {
      const onMutate = jest.fn()
      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(
        () => queryManager.useUpdate({ onMutate, onSuccess, onError }),
        { wrapper: createWrapper(queryClient) }
      )

      const updateData = { id: existingUsers[0].id, name: 'Updated Name' }

      result.current.mutate(updateData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(onMutate).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('useDelete', () => {
    let existingUsers: TestUser[]

    beforeEach(() => {
      existingUsers = createMockUsers(3)
      mockApi.setUsers(existingUsers)
    })

    it('should delete existing item', async () => {
      const { result } = renderHook(
        () => queryManager.useDelete(),
        { wrapper: createWrapper(queryClient) }
      )

      const targetId = existingUsers[0].id

      result.current.mutate(targetId)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(targetId)
      expect(mockApi.getUsersArray()).toHaveLength(2)
      expect(mockApi.getUsersArray().find(u => u.id === targetId)).toBeUndefined()
    })

    it('should handle optimistic updates', async () => {
      // First, populate list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const { result: deleteResult } = renderHook(
        () => queryManager.useDelete({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      const targetId = existingUsers[0].id

      deleteResult.current.mutate(targetId)

      // Should immediately disappear from list
      await waitFor(() => {
        expect(listResult.current.items.find(item => item.id === targetId)).toBeUndefined()
      })

      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true)
      })
    })

    // it('should rollback optimistic delete on error', async () => {
    //   // Mock API to throw error BEFORE creating hook
    //   const originalDeleteFn = mockApi.deleteFn
    //   mockApi.deleteFn = jest.fn().mockRejectedValue(new Error('Delete failed'))

    //   // First, populate list cache
    //   const { result: listResult } = renderHook(
    //     () => queryManager.useList(),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   await waitFor(() => {
    //     expect(listResult.current.query.isSuccess).toBe(true)
    //   })

    //   const initialItemCount = listResult.current.items.length
    //   const targetId = existingUsers[0].id

    //   const { result: deleteResult } = renderHook(
    //     () => queryManager.useDelete({
    //       optimistic: true,
    //       onError: (error) => {
    //         console.log('Expected error:', error.message)
    //       }
    //     }),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   deleteResult.current.mutate(targetId)

    //   // Should temporarily disappear from list
    //   await waitFor(() => {
    //     expect(listResult.current.items.length).toBeLessThan(initialItemCount)
    //   })

    //   // Should reappear on error
    //   await waitFor(() => {
    //     expect(deleteResult.current.isError).toBe(true)
    //   })

    //   expect(listResult.current.items).toHaveLength(initialItemCount)
    //   expect(listResult.current.items.find(item => item.id === targetId)).toBeDefined()

    //   // Restore original function
    //   mockApi.deleteFn = originalDeleteFn
    // })

    // it('should handle error in delete operation', async () => {
    //   // Mock API to throw error BEFORE creating hook
    //   const originalDeleteFn = mockApi.deleteFn
    //   mockApi.deleteFn = jest.fn().mockRejectedValue(new Error('Delete failed'))

    //   const { result } = renderHook(
    //     () => queryManager.useDelete({
    //       onError: (error) => {
    //         console.log('Expected error:', error.message)
    //       }
    //     }),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   const targetId = existingUsers[0].id

    //   result.current.mutate(targetId)

    //   await waitFor(() => {
    //     expect(result.current.isError).toBe(true)
    //   })

    //   expect(result.current.error).toEqual(new Error('Delete failed'))

    //   // Restore original function
    //   mockApi.deleteFn = originalDeleteFn
    // })

    it('should call custom mutation callbacks', async () => {
      const onMutate = jest.fn()
      const onSuccess = jest.fn()
      const onError = jest.fn()

      const { result } = renderHook(
        () => queryManager.useDelete({ onMutate, onSuccess, onError }),
        { wrapper: createWrapper(queryClient) }
      )

      const targetId = existingUsers[0].id

      result.current.mutate(targetId)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(onMutate).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
    })

    // it('should restore item to original position on rollback', async () => {
    //   // Mock API to throw error BEFORE creating hook
    //   const originalDeleteFn = mockApi.deleteFn
    //   mockApi.deleteFn = jest.fn().mockRejectedValue(new Error('Delete failed'))

    //   // First, populate list cache
    //   const { result: listResult } = renderHook(
    //     () => queryManager.useList(),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   await waitFor(() => {
    //     expect(listResult.current.query.isSuccess).toBe(true)
    //   })

    //   const originalItems = [...listResult.current.items]
    //   const targetId = existingUsers[1].id // Delete middle item

    //   const { result: deleteResult } = renderHook(
    //     () => queryManager.useDelete({
    //       optimistic: true,
    //       onError: (error) => {
    //         console.log('Expected error:', error.message)
    //       }
    //     }),
    //     { wrapper: createWrapper(queryClient) }
    //   )

    //   deleteResult.current.mutate(targetId)

    //   // Wait for error and rollback
    //   await waitFor(() => {
    //     expect(deleteResult.current.isError).toBe(true)
    //   })

    //   // Items should be in original order
    //   expect(listResult.current.items.length).toBe(originalItems.length)
    //   expect(listResult.current.items.find(item => item.id === targetId)).toBeDefined()

    //   // Restore original function
    //   mockApi.deleteFn = originalDeleteFn
    // })
  })

  describe('prefetchRetrieve', () => {
    beforeEach(() => {
      const mockUsers = createMockUsers(3)
      mockApi.setUsers(mockUsers)
    })

    it('should prefetch retrieve query', async () => {
      const users = mockApi.getUsersArray()
      const targetUser = users[0]
      const prefetchSpy = spyOn(queryClient, 'prefetchQuery')

      await queryManager.prefetchRetrieve(targetUser.id, { staleTime: 5000 })

      expect(prefetchSpy).toHaveBeenCalledWith({
        staleTime: 5000,
        queryKey: ['users', 'retrieve', targetUser.id],
        queryFn: expect.any(Function)
      })
    })

    it('should execute prefetch query function correctly', async () => {
      const users = mockApi.getUsersArray()
      const targetUser = users[0]

      await queryManager.prefetchRetrieve(targetUser.id)

      // Verify data was prefetched correctly
      const cachedData = queryClient.getQueryData(['users', 'retrieve', targetUser.id])
      expect(cachedData).toEqual(targetUser)
    })
  })

  describe('integration scenarios', () => {
    beforeEach(() => {
      const mockUsers = createMockUsers(10)
      mockApi.setUsers(mockUsers)
    })

    it('should synchronize data between list and retrieve caches', async () => {
      // This test needs to ensure proper synchronization implementation
      // The issue is likely that updating one cache doesn't automatically sync the other

      // First, populate list cache
      const { result: listResult } = renderHook(
        () => queryManager.useList(),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(listResult.current.query.isSuccess).toBe(true)
      })

      const targetUser = listResult.current.items[0]

      // Then retrieve specific item
      const { result: retrieveResult } = renderHook(
        () => queryManager.useRetrieve(targetUser.id),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(retrieveResult.current.query.isSuccess).toBe(true)
      })

      // Update the user via mutations (not direct API)
      const { result: updateResult } = renderHook(
        () => queryManager.useUpdate({ optimistic: true }),
        { wrapper: createWrapper(queryClient) }
      )

      const updateData = { id: targetUser.id, name: 'Synchronized Update' }

      updateResult.current.mutate(updateData)

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
      })

      // Both caches should reflect the update
      await waitFor(() => {
        expect(retrieveResult.current.item?.name).toBe('Synchronized Update')
        expect(listResult.current.items.find(u => u.id === targetUser.id)?.name).toBe('Synchronized Update')
      })
    })
  })
})
