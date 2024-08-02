
export function multiplierProperty<T extends string>(
  base: number,
  property: T,
) {
  return (multiplier: number | string) => {
    const value = base * Number(multiplier)

    return {
      [property]: value,
    }
  }
}
