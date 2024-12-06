export type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
]

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never

export type Paths<T, D extends number = 2> = [D] extends [never]
  ? never
  : (T extends Date
    ? ''
      : (T extends object
        ? {
            [K in keyof T]-?: K extends string | number
              ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
              : never;
          }[keyof T]
        : '')
    )

export type ExtractPath<T> = T extends object
  ? {
    [K in keyof T & (string | number)]: T[K] extends object
      ? `${K}` | `${K}.${ExtractPath<T[K]>}`
      : `${K}`
  }[keyof T & (string | number)]
  : never
