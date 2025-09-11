/**
 * Converts a hex color to HSL format.
 * 
 * @param {string} hex - Hex color string (e.g., '#ff5733')
 * @returns {object} HSL object with h (0-360), s (0-100), l (0-100)
 */
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
    l: Math.round(l * 100),
  }
}

/**
 * Converts HSL values to hex color format.
 * 
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} Hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))

  return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Converts a hex color to RGB format.
 * 
 * @param {string} hex - Hex color string (e.g., '#ff5733')
 * @returns {object} RGB object with r, g, b values (0-255)
 */
export function hexToRGB(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

/**
 * Converts HSL values to RGB format.
 * 
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {object} RGB object with r, g, b values (0-255)
 */
export function hslToRGB(h: number, s: number, l: number) {
  s /= 100
  l /= 100

  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))

  return {
    r: f(0),
    g: f(8),
    b: f(4),
  }
}

/**
 * Converts RGB values to HSL format.
 * 
 * @param {object} rgb - RGB object with r, g, b values (0-255)
 * @returns {object} HSL object with h (0-360), s (0-100), l (0-100)
 */
export function rgbToHSL(rgb: { r: number; g: number; b: number }): { h: number; s: number; l: number } {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Calculates the relative luminance of an RGB color.
 * Uses the WCAG formula for accessibility calculations.
 * 
 * @param {object} rgb - RGB object with r, g, b values (0-255)
 * @returns {number} Luminance value (0-1)
 */
export function getLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const [R, G, B] = [r, g, b].map(c => {
    const channel = c / 255
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/**
 * Determines the best text color (dark or light) for a given background.
 * Uses luminance calculation for optimal contrast.
 * 
 * @param {string} backgroundHex - Background hex color
 * @param {string} darkColor - Dark text color option
 * @param {string} lightColor - Light text color option
 * @returns {string} Recommended text color
 */
export function getTextColor(backgroundHex: string, darkColor = 'black', lightColor = 'white'): string {
  const rgb = hexToRGB(backgroundHex)
  const luminance = getLuminance(rgb)
  return luminance > 0.5 ? darkColor : lightColor
}
