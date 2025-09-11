import '@testing-library/jest-dom'
import { beforeEach } from 'bun:test'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
})

const { window } = dom
const { document } = window

global.window = window as any
global.document = document
global.navigator = window.navigator as any
global.HTMLElement = window.HTMLElement
global.Element = window.Element
global.Node = window.Node

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

console.log('JSDOM - document defined:', typeof document !== 'undefined')
