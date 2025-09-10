export interface StateStorage {
  getItem: (name: string) => any | null
  setItem: (name: string, value: any) => void
  removeItem: (name: string) => void
}