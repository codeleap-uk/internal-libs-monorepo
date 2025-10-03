import { describe, it, expect, beforeEach, spyOn, mock } from 'bun:test'
import { Mutations, createMutations } from '../lib/Mutations'
import { QueryKeys } from '../lib/QueryKeys'
import { createTestQueryClient, TestUser, TestUserFilters, createMockUsers } from './setup'
import { InfiniteData } from '@tanstack/react-query'

describe('Mutations', () => {
  let queryClient: ReturnType<typeof createTestQueryClient>
  let queryKeys: QueryKeys<TestUser, TestUserFilters>
  let mutations: Mutations<TestUser, TestUserFilters>

  beforeEach(() => {
    queryClient = createTestQueryClient()
    queryKeys = new QueryKeys('users', queryClient)
    mutations = new Mutations(queryKeys, queryClient, 'users')
  })

  describe('constructor', () => {
    it('should create Mutations instance with correct parameters', () => {
      expect(mutations).toBeInstanceOf(Mutations)
      expect(mutations['queryKeys']).toBe(queryKeys)
      expect(mutations['queryClient']).toBe(queryClient)
      expect(mutations['queryName']).toBe('users')
    })
  })

  describe('addItem', () => {
    const mockUsers = createMockUsers(3)

    beforeEach(() => {
      const mockData: InfiniteData<TestUser[], number> = {
        pages: [mockUsers.slice(0, 2), mockUsers.slice(2)],
        pageParams: [0, 2]
      }
      queryClient.setQueryData(['users', 'list'], mockData)
    })

    it('should add item to start by default', () => {
      const newUser = createMockUsers(1)[0]

      mutations.addItem(newUser)

      const data = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      expect(data.pages[0][0]).toEqual(newUser)
      expect(data.pages[0]).toHaveLength(3) // original 2 + new 1
    })

    it('should add item to start when position is "start"', () => {
      const newUser = createMockUsers(1)[0]

      mutations.addItem(newUser, 'start')

      const data = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      expect(data.pages[0][0]).toEqual(newUser)
    })

    it('should add item to end when position is "end"', () => {
      const newUser = createMockUsers(1)[0]

      mutations.addItem(newUser, 'end')

      const data = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      const lastPage = data.pages[data.pages.length - 1]
      expect(lastPage[lastPage.length - 1]).toEqual(newUser)
    })

    it('should create new data when no cache exists', () => {
      queryClient.clear()
      const newUser = createMockUsers(1)[0]

      mutations.addItem(newUser)

      const data = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      expect(data).toEqual({
        pageParams: [0],
        pages: [[newUser]]
      })
    })

    it('should add item with specific list filters', () => {
      const filters = { status: 'active' as const }
      const newUser = createMockUsers(1)[0]

      // Set up filtered cache
      queryClient.setQueryData(['users', 'list', filters], {
        pages: [mockUsers.slice(0, 1)],
        pageParams: [0]
      })

      mutations.addItem(newUser, 'start', filters)

      const data = queryClient.getQueryData(['users', 'list', filters]) as InfiniteData<TestUser[], number>
      expect(data.pages[0][0]).toEqual(newUser)
    })

    it('should handle multiple query keys (RemovedItemMap)', () => {
      const newUser = createMockUsers(1)[0]
      const queryKey1 = ['users', 'list']
      const queryKey2 = ['users', 'list', { status: 'active' }]

      // Set up multiple caches
      queryClient.setQueryData(queryKey1, {
        pages: [mockUsers.slice(0, 2)],
        pageParams: [0]
      })
      queryClient.setQueryData(queryKey2, {
        pages: [mockUsers.slice(0, 1)],
        pageParams: [0]
      })

      const removedItemMap = [
        [queryKey1, { pageIndex: 0, itemIndex: 1 }],
        [queryKey2, { pageIndex: 0, itemIndex: 0 }]
      ] as any

      mutations.addItem(newUser, removedItemMap)

      const data1 = queryClient.getQueryData(queryKey1) as InfiniteData<TestUser[], number>
      const data2 = queryClient.getQueryData(queryKey2) as InfiniteData<TestUser[], number>

      expect(data1.pages[0][1]).toEqual(newUser)
      expect(data2.pages[0][0]).toEqual(newUser)
    })

    it('should handle item position beyond page length', () => {
      const newUser = createMockUsers(1)[0]
      const queryKey = ['users', 'list']

      queryClient.setQueryData(queryKey, {
        pages: [mockUsers.slice(0, 1)],
        pageParams: [0]
      })

      const removedItemMap = [
        [queryKey, { pageIndex: 0, itemIndex: 10 }] // Beyond page length
      ] as any

      mutations.addItem(newUser, removedItemMap)

      const data = queryClient.getQueryData(queryKey) as InfiniteData<TestUser[], number>
      expect(data.pages[0][data.pages[0].length - 1]).toEqual(newUser)
    })

    it('should handle page index beyond pages length', () => {
      const newUser = createMockUsers(1)[0]
      const queryKey = ['users', 'list']

      queryClient.setQueryData(queryKey, {
        pages: [mockUsers.slice(0, 1)],
        pageParams: [0]
      })

      const removedItemMap = [
        [queryKey, { pageIndex: 5, itemIndex: 0 }] // Beyond pages length
      ] as any

      mutations.addItem(newUser, removedItemMap)

      const data = queryClient.getQueryData(queryKey) as InfiniteData<TestUser[], number>
      const lastPage = data.pages[data.pages.length - 1]
      expect(lastPage[lastPage.length - 1]).toEqual(newUser)
    })

    it('should handle empty pages array', () => {
      const newUser = createMockUsers(1)[0]
      const queryKey = ['users', 'list']

      queryClient.setQueryData(queryKey, {
        pages: [],
        pageParams: []
      })

      const removedItemMap = [
        [queryKey, { pageIndex: 0, itemIndex: 0 }]
      ] as any

      mutations.addItem(newUser, removedItemMap)

      const data = queryClient.getQueryData(queryKey) as InfiniteData<TestUser[], number>
      expect(data.pages[0]).toEqual([newUser])
    })
  })

  describe('removeItem', () => {
    const mockUsers = createMockUsers(3)

    beforeEach(() => {
      // Set up multiple list queries
      queryClient.setQueryData(['users', 'list'], {
        pages: [mockUsers.slice(0, 2), [mockUsers[2]]],
        pageParams: [0, 2]
      })
      queryClient.setQueryData(['users', 'list', { status: 'active' }], {
        pages: [[mockUsers[0]]],
        pageParams: [0]
      })

      // Set up retrieve cache
      queryClient.setQueryData(['users', 'retrieve', mockUsers[0].id], mockUsers[0])
    })

    it('should remove item from all list queries and return removal map', () => {
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        { queryKey: ['users', 'list'], state: { data: queryClient.getQueryData(['users', 'list']) } },
        { queryKey: ['users', 'list', { status: 'active' }], state: { data: queryClient.getQueryData(['users', 'list', { status: 'active' }]) } }
      ] as any)

      const removedMap = mutations.removeItem(mockUsers[0].id)

      expect(removedMap).toHaveLength(2)
      expect(removedMap![0]).toEqual([['users', 'list'], { pageIndex: 0, itemIndex: 0 }])
      expect(removedMap![1]).toEqual([['users', 'list', { status: 'active' }], { pageIndex: 0, itemIndex: 0 }])

      // Verify item was removed from caches
      const data1 = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      const data2 = queryClient.getQueryData(['users', 'list', { status: 'active' }]) as InfiniteData<TestUser[], number>

      expect(data1.pages[0]).not.toContain(mockUsers[0])
      expect(data2.pages[0]).toHaveLength(0)
    })

    it('should remove retrieve query data', () => {
      const removeRetrieveQueryDataSpy = spyOn(queryKeys, 'removeRetrieveQueryData')
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([])

      mutations.removeItem(mockUsers[0].id)

      expect(removeRetrieveQueryDataSpy).toHaveBeenCalledWith(mockUsers[0].id)
    })

    it('should return empty array when item not found in any list', () => {
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        { queryKey: ['users', 'list'], state: { data: queryClient.getQueryData(['users', 'list']) } }
      ] as any)

      const removedMap = mutations.removeItem('non-existent-id')

      expect(removedMap).toEqual([])
    })

    it('should handle empty pages after removal', () => {
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        { queryKey: ['users', 'list'], state: { data: { pages: [[mockUsers[0]]], pageParams: [0] } } }
      ] as any)

      mutations.removeItem(mockUsers[0].id)

      const data = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      expect(data.pages).toEqual([[]])
      expect(data.pageParams).toEqual([0])
    })

    it('should filter out empty pages', () => {
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        { queryKey: ['users', 'list'], state: { data: { pages: [[mockUsers[0]], [mockUsers[1]]], pageParams: [0, 1] } } }
      ] as any)

      mutations.removeItem(mockUsers[0].id)

      const data = queryClient.getQueryData(['users', 'list']) as InfiniteData<TestUser[], number>
      expect(data.pages).toEqual([[mockUsers[1]]])
      expect(data.pageParams).toEqual([0])
    })

    it('should handle queries with no current data', () => {
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        { queryKey: ['users', 'list'], state: { data: null } }
      ] as any)

      const removedMap = mutations.removeItem(mockUsers[0].id)

      expect(removedMap).toEqual([])
    })
  })

  describe('updateItems', () => {
    const mockUsers = createMockUsers(3)

    beforeEach(() => {
      const getAllListQueriesSpy = spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        {
          queryKey: ['users', 'list'],
          state: {
            data: {
              pages: [mockUsers.slice(0, 2), [mockUsers[2]]],
              pageParams: [0, 2]
            }
          }
        }
      ] as any)
    })

    it('should update single item by id', () => {
      const updateData = { ...mockUsers[0], name: 'Updated Name' }
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'retrieve', updateData.id],
        updateData
      )
    })

    it('should update single item by tempId', () => {
      const updateData = { ...mockUsers[0], name: 'Updated Name', tempId: 'temp-1' }
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      const expectedData = { ...updateData }
      // @ts-ignore
      delete expectedData.tempId

      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'retrieve', updateData.id],
        expectedData
      )
    })

    it('should update multiple items', () => {
      const updateData = [
        { ...mockUsers[0], name: 'Updated Name 1' },
        { ...mockUsers[1], name: 'Updated Name 2' }
      ]
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      expect(setQueryDataSpy).toHaveBeenCalledTimes(3) // 2 retrieve + 1 list update
    })

    it('should not update if data is the same (deep equal)', () => {
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      // Update with same data
      mutations.updateItems(mockUsers[0])

      // Should only set retrieve cache, not update list (no changes)
      expect(setQueryDataSpy).toHaveBeenCalledTimes(1)
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'retrieve', mockUsers[0].id],
        mockUsers[0]
      )
    })

    it('should update list cache when item data changes', () => {
      const updateData = { ...mockUsers[0], name: 'Updated Name' }
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      // Should update both retrieve and list cache
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'retrieve', updateData.id],
        updateData
      )
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'list'],
        expect.objectContaining({
          pages: expect.arrayContaining([
            expect.arrayContaining([updateData])
          ])
        })
      )
    })

    it('should handle queries with no data', () => {
      // Override the spy for this test
      spyOn(queryKeys, 'getAllListQueries').mockReturnValue([
        { queryKey: ['users', 'list'], state: { data: null } }
      ] as any)

      const updateData = { ...mockUsers[0], name: 'Updated Name' }
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      // Should only update retrieve cache
      expect(setQueryDataSpy).toHaveBeenCalledTimes(1)
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'retrieve', updateData.id],
        updateData
      )
    })

    it('should preserve page structure when updating items', () => {
      const updateData = { ...mockUsers[2], name: 'Updated Name' } // Item in second page
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'list'],
        expect.objectContaining({
          pages: [
            mockUsers.slice(0, 2), // First page unchanged
            [updateData] // Second page with updated item
          ],
          pageParams: [0, 2]
        })
      )
    })

    it('should handle items not found in list', () => {
      const nonExistentItem = { id: 'non-existent', name: 'New Name' } as TestUser
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(nonExistentItem)

      // Should only update retrieve cache
      expect(setQueryDataSpy).toHaveBeenCalledTimes(1)
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        ['users', 'retrieve', nonExistentItem.id],
        nonExistentItem
      )
    })

    it('should remove tempId from cached data', () => {
      const updateData = { ...mockUsers[0], name: 'Updated Name', tempId: 'temp-123' }
      const setQueryDataSpy = spyOn(queryClient, 'setQueryData')

      mutations.updateItems(updateData)

      // Check retrieve cache call - tempId should be removed
      const retrieveCall = setQueryDataSpy.mock.calls.find(call =>
        Array.isArray(call[0]) && call[0].includes('retrieve')
      )

      expect(retrieveCall).toBeDefined()
      const cachedData = retrieveCall![1] as any
      expect(cachedData).not.toHaveProperty('tempId')
      expect(cachedData.name).toBe('Updated Name')

      // Check list cache call - tempId should be removed from items
      const listCall = setQueryDataSpy.mock.calls.find(call =>
        Array.isArray(call[0]) && call[0].includes('list')
      )

      if (listCall) {
        const updatedListData = listCall[1] as any
        const updatedItem = updatedListData.pages.flat().find((item: any) => item.id === updateData.id)
        expect(updatedItem).not.toHaveProperty('tempId')
      }
    })
  })

  describe('createMutations factory', () => {
    it('should create Mutations instance', () => {
      const mutations = createMutations(queryKeys, queryClient, 'test')

      expect(mutations).toBeInstanceOf(Mutations)
      expect(mutations['queryKeys']).toBe(queryKeys)
      expect(mutations['queryClient']).toBe(queryClient)
      expect(mutations['queryName']).toBe('test')
    })
  })
})