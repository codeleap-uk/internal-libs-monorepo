type Unit = 'px' | 'vh' | 'dvh' | 'vw' | 'dvw' | '%' | 'lvh' | 'svh'

class CalcBuilder {
  private expression: string

  constructor(initial: number, unit: Unit = 'px') {
    this.expression = `${initial}${unit}`
  }

  private wrap(value: string): string {
    return `(${value})`
  }

  sub(value: number, unit: Unit = 'px') {
    const val = `${value}${unit}`
    this.expression = `${this.wrap(this.expression)} - ${this.wrap(val)}`
    return this
  }

  add(value: number, unit: Unit = 'px') {
    const val = `${value}${unit}`
    this.expression = `${this.wrap(this.expression)} + ${this.wrap(val)}`
    return this
  }

  mult(value: number) {
    this.expression = `${this.wrap(this.expression)} * ${value}`
    return this
  }

  div(value: number) {
    this.expression = `${this.wrap(this.expression)} / ${value}`
    return this
  }

  build() {
    return `calc(${this.expression})`
  }
}

export const calc = (base: number, unit: Unit = 'px') => new CalcBuilder(base, unit)
