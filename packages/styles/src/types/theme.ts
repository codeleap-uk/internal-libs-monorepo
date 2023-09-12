type ColorMap = {
  [key: string]: string
}

type BreakpointMap = {
  [key: string]: number
}

export type Theme = {
  colors: ColorMap
  alternateColors?: {
    [key: string]: ColorMap
  }
  breakpoints?: BreakpointMap
}
