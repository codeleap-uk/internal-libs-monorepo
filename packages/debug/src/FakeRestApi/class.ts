import { FakeItem, FakeRestApiOptions, PaginationResponse } from './types'

/**
 * A fake REST API implementation for testing and prototyping.
 * Provides CRUD operations with pagination support and optional request delays.
 * @template T - The type of items to manage, must extend FakeItem
 * @template F - The type of filters to apply when listing items
 */
export class FakeRestApi<T extends FakeItem, F = Record<string, unknown>> {
  private data: T[] = []
  private options: Required<FakeRestApiOptions<T, F>>

  /**
   * Gets the ID of the last item in the data array.
   * @private
   * @returns The highest ID or 0 if no items exist
   */
  private get lastId(): T['id'] {
    return this.data.length > 0 ? Math.max(...this.data.map((i) => i.id)) : 0
  }

  /**
   * Gets the name of the API.
   * @returns The API name
   */
  public get name(): string {
    return this.options.name
  }

  /**
   * Gets the current count of items.
   * @returns The number of items in the data array
   */
  public get count(): number {
    return this.data.length
  }

  /**
   * Creates a new FakeRestApi instance.
   * @param options - Configuration options for the API
   */
  constructor(options: FakeRestApiOptions<T, F>) {
    this.options = {
      delayMs: 2500,
      maxCount: 100,
      enableDelay: false,
      filterFn: () => true,
      ...options,
    }

    this.initialize()
  }

  /**
   * Initializes the data array with items up to maxCount.
   * @private
   */
  private initialize(): void {
    this.data = Array.from({ length: this.options.maxCount }, (_, i) =>
      this.generateItem(i + 1)
    )
  }

  /**
   * Updates the API options partially.
   * @param newOptions - Partial options to update
   */
  public setOptions(newOptions: Partial<FakeRestApiOptions<T, F>>): void {
    this.options = { ...this.options, ...newOptions }
  }

  /**
   * Generates a new item using the generator function.
   * @param id - The ID for the new item (defaults to lastId + 1)
   * @returns A newly generated item
   */
  public generateItem(id: T['id'] = this.lastId + 1): T {
    return this.options.generatorFn(id)
  }

  /**
   * Introduces an artificial delay if enabled in options.
   * @private
   * @returns A promise that resolves after the delay period
   */
  private async delay(): Promise<void> {
    if (!this.options.enableDelay) return

    return new Promise((resolve) => {
      setTimeout(resolve, this.options.delayMs)
    })
  }

  /**
   * Builds a URL with pagination parameters.
   * @private
   * @param limit - Number of items per page
   * @param offset - Starting position
   * @returns A formatted URL string
   */
  private buildUrl(limit: number, offset: number): string {
    return `https://api.${this.name}?limit=${limit}&offset=${offset}`
  }

  /**
   * Retrieves a paginated list of items with optional filtering.
   * @param limit - Number of items to return (default: 10)
   * @param offset - Starting position (default: 0)
   * @param filters - Optional filters to apply
   * @returns A promise that resolves to a paginated response
   */
  async listItems(
    limit = 10,
    offset = 0,
    filters?: F
  ): Promise<PaginationResponse<T>> {
    await this.delay()

    const hasFilters = filters && Object.keys(filters).length > 0
    const items = hasFilters
      ? this.data.filter((item) => this.options.filterFn(item, filters))
      : this.data

    const total = items.length
    const start = Math.max(0, offset)
    const end = Math.min(start + limit, total)

    const results = items.slice(start, end)

    return {
      count: total,
      next: end < total ? this.buildUrl(limit, end) : null,
      previous: start > 0 ? this.buildUrl(limit, Math.max(0, start - limit)) : null,
      results,
    }
  }

  /**
   * Retrieves a single item by ID.
   * @param id - The ID of the item to retrieve
   * @returns A promise that resolves to the requested item
   * @throws {Error} If the item is not found
   */
  async retrieveItem(id: T['id']): Promise<T> {
    await this.delay()

    const item = this.data.find((i) => i.id === id)

    if (!item) {
      throw new Error(`${this.name} with id ${id} not found`)
    }

    return item
  }

  /**
   * Creates a new item and adds it to the data array.
   * @param item - Optional partial item data (ID will be auto-generated)
   * @returns A promise that resolves to the created item
   */
  async createItem(item?: Partial<T>): Promise<T> {
    await this.delay()

    const id = this.lastId + 1
    const newItem = item ? { ...item, id } as T : this.generateItem(id)

    this.data.push(newItem)

    return newItem
  }

  /**
   * Updates an existing item by ID.
   * @param id - The ID of the item to update
   * @param updates - Partial item data to update
   * @returns A promise that resolves to the updated item
   * @throws {Error} If the item is not found
   */
  async updateItem(id: T['id'], updates: Partial<T>): Promise<T> {
    await this.delay()

    const index = this.data.findIndex((i) => i.id === id)

    if (index === -1) {
      throw new Error(`${this.name} with id ${id} not found`)
    }

    this.data[index] = { ...this.data[index], ...updates, id }

    return this.data[index]
  }

  /**
   * Deletes an item by ID.
   * @param id - The ID of the item to delete
   * @returns A promise that resolves to the deleted item
   * @throws {Error} If the item is not found
   */
  async deleteItem(id: T['id']): Promise<T> {
    await this.delay()

    const index = this.data.findIndex((i) => i.id === id)

    if (index === -1) {
      throw new Error(`${this.name} with id ${id} not found`)
    }

    const [deleted] = this.data.splice(index, 1)

    return deleted
  }

  /**
   * Resets the data array to its initial state by regenerating all items.
   */
  public reset(): void {
    this.initialize()
  }

  /**
   * Clears all items from the data array.
   */
  public clear(): void {
    this.data = []
  }

  /**
   * Gets a readonly copy of all items in the data array.
   * @returns A frozen array of all items
   */
  public getData(): readonly T[] {
    return Object.freeze([...this.data])
  }

  /**
   * Gets a single item by ID without delay.
   * @param id - The ID of the item to retrieve
   * @returns The item if found, undefined otherwise
   */
  public getItem(id: T['id']): T | undefined {
    return this.data.find((i) => i.id === id)
  }
}
