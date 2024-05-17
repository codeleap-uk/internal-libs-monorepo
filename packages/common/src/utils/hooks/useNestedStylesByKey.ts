export function useNestedStylesByKey<T extends string, O extends StylesOf<T> = StylesOf<T>>(match: string, variantStyles: any): O {

  return useMemo(() => {
    return getNestedStylesByKey(match, variantStyles) as O
  }, [])

}
