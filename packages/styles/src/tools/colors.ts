import { ColorMap } from '../types'

export function hexToHSL(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))

  return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

export function hexToRGB(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export function hslToRGB(h: number, s: number, l: number) {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))

  return {
    r: f(0),
    g: f(8),
    b: f(4)
  }
}

export function generateColorScheme(
  anchorHex: string, 
  prefix: string = 'primary'
): ColorMap {
  const { h, s } = hexToHSL(anchorHex)
  const baseRGB = hexToRGB(anchorHex)
  
  const scheme: ColorMap = {}
  
  const lightnesses = [95, 85, 75, 60, 45, 30, 27, 21, 16, 10]
  
  lightnesses.forEach((lightness, index) => {
    const step = (index + 1) * 100
    const rgb = hslToRGB(h, s, lightness)
    scheme[`${prefix}Solid${step}`] = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.00)`
  })
  
  const alphas = [0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90]
  
  alphas.forEach((alpha, index) => {
    const step = (index + 1) * 100
    scheme[`${prefix}Transparent${step}`] = `rgba(${baseRGB.r}, ${baseRGB.g}, ${baseRGB.b}, ${alpha.toFixed(2)})`
  })
  
  return scheme
}

export function getLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [R, G, B] = [r, g, b].map(c => {
    const channel = c / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function getTextColor(backgroundHex: string, darkColor = 'black', lightColor = 'white'): string {
  const rgb = hexToRGB(backgroundHex)
  const luminance = getLuminance(rgb)
  return luminance > 0.5 ? darkColor : lightColor
}