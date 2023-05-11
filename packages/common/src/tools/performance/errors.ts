import { InspectRenderOptions } from '.'

type ErrorArgs = InspectRenderOptions & {
  name: string
  maxRenders: number
}

type ErrorNames = 'maxRenders'

const defineError = (errorName: ErrorNames, args: Partial<ErrorArgs>) => {
  switch (errorName) {
    case 'maxRenders':
      return `${args.name} is rendering more than ${args.maxRenders}time per ${
        1000 / 1000
      }second!
      If you aware of this, you can disable it in the Settings.ts > Performancer.
      `
  }
}

export class PerformanceError extends Error {
  constructor(errorName: ErrorNames, args: Partial<ErrorArgs>) {
    super(defineError(errorName, args))
    this.name = 'Codeleap:Perf'
  }
}
