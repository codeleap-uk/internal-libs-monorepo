import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { renderHook, act, waitFor } from "@testing-library/react"
import { QueryOperations } from "../lib/QueryOperations"

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe("QueryOperations", () => {
  let queryClient: QueryClient
  let operations: QueryOperations<{}, {}>

  beforeEach(() => {
    queryClient = new QueryClient()
    operations = new QueryOperations({ queryClient })
  })

  it("registers a mutation correctly", () => {
    const fn = mock(() => Promise.resolve("ok"))
    const ops = operations.mutation("createUser", fn)

    expect(Object.keys(ops.mutations)).toContain("createUser")
    expect(typeof ops.mutations.createUser).toBe("function")
  })

  it("registers a query correctly", () => {
    const fn = mock((id: string) => Promise.resolve({ id }))
    const ops = operations.query("getUser", fn)

    expect(Object.keys(ops.queries)).toContain("getUser")
    expect(typeof ops.queries.getUser).toBe("function")
  })

  it("getQueryKey includes params when passed", () => {
    const ops = operations.query("getUser", async (id: string) => ({ id }))
    expect(ops.getQueryKey("getUser", "123")).toEqual(["getUser", "123"])
    expect(ops.getQueryKey("getUser")).toEqual(["getUser"])
  })

  it("getMutationKey returns mutation key", () => {
    const ops = operations.mutation("createUser", async (data: any) => data)
    expect(ops.getMutationKey("createUser")).toEqual(["createUser"])
  })

  it("prefetchQuery calls queryClient.prefetchQuery", async () => {
    const fn = mock((id: string) => Promise.resolve({ id }))
    const ops = operations.query("getUser", fn)

    const spy = spyOn(queryClient, "prefetchQuery")
    await ops.prefetchQuery("getUser", "abc")

    expect(spy).toHaveBeenCalled()
    expect(spy.mock.calls[0][0].queryKey).toEqual(["getUser", "abc"])
  })

  it("getQueryData fetches from cache or prefetches", async () => {
    const fn = async (id: string) => ({ id })
    const ops = operations.query("getUser", fn)

    const spyPrefetch = spyOn(queryClient, "prefetchQuery")

    const data = await ops.getQueryData("getUser", "123")
    expect(data).toBeDefined()
    expect(spyPrefetch).toHaveBeenCalled()
  })

  describe("useMutation hook", () => {
    it("runs a mutation and returns expected result", async () => {
      const ops = operations.mutation("createUser", async (user: { name: string }) => {
        return { id: "1", ...user }
      })

      const { result } = renderHook(
        () => ops.useMutation("createUser"),
        { wrapper: createWrapper(queryClient) }
      )

      let response: any
      await act(async () => {
        response = await result.current.mutateAsync({ name: "John" })
      })

      expect(response).toEqual({ id: "1", name: "John" })
    })
  })

  describe("useQuery hook", () => {
    it("fetches query result successfully", async () => {
      const ops = operations.query("getUser", async (id: string) => {
        return { id, name: "Alice" }
      })

      const { result } = renderHook(
        () => ops.useQuery("getUser", "42", { enabled: true }),
        { wrapper: createWrapper(queryClient) }
      )

      await waitFor(() => {
        expect(result.current.data).toEqual({ id: "42", name: "Alice" })
      })
    })
  })
})
