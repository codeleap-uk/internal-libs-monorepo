export interface StateStorage {
  getItem: (name: string) => string | null
  setItem: (name: string, value: any) => void
  removeItem: (name: string) => void
}