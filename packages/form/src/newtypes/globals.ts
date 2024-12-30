export interface IFieldRef<T> {
  getValue(): T
  scrollIntoView(): Promise<void>
  focus(): void
  blur(): void
  emit(event: string, ...args: any[]): void
}


export interface IFieldProps {
  
}