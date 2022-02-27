import { AnyFunction, FunctionType } from '../types'

export const defaultPresets = {
  inline: {
    display: 'inline-block',
  },
  block: {
    display: 'block',
  },
  flex: {
    display: 'flex',
    flex: 1,
  },
  inlineFlex: {
    display: 'inline-flex',
  },
  absolute: {
    position: 'absolute',
  },
  fixed: {
    position: 'fixed',
  },
  sticky: {
    position: 'sticky',
  },
  hidden: {
    display: 'none',
  },
  //
  // *** Layout ***
  //
  full: {
    width: '100%',
    height: '100%',
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  fullView: {
    width: '100vw',
    // height: '100vh',
    height: 'calc(100vh - calc(100vh - 100%))',
  },
  fullViewWidth: {
    width: '100vw',
  },
  fullViewHeight: {
    height: 'calc(100vh - calc(100vh - 100%))',
    // height: '100vh',
  },
  whole: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  centerRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  listStyles: {
    overflow: 'auto',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignCenter: {
    alignItems: 'center',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  justifySpaceAround: {
    justifyContent: 'space-around',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  textCenter: {
    textAlign: 'center',
  },
  //
  // *** Styles ***
  //
  blur: {
    backdropFilter: 'blur(4px)',
    '-webkit-backdrop-filter': 'blur(4px)',
    transition: '500ms',
  },
  elevated: {
    boxShadow: '0px 0px 16px 16px #aaaaaa1a',
  },
  neumorphism: {
    boxShadow: '10px 10px 20px 0 #AEAEC077, -10px -10px 20px 0 #fff',
  },
  scrollX: {
    overflowX: 'auto',
  },
  scrollY: {
    overflowY: 'auto',
  },
  scrollXY: {
    overflowX: 'auto',
    overflowY: 'auto',
  },
  wrap: {
    flexWrap: 'wrap',
  },
  debRed: {
    backgroundColor: 'red',
  },
  debGreen: {
    backgroundColor: 'green',
  },
  debBlue: {
    backgroundColor: 'blue',
  },
  debYellow: {
    backgroundColor: 'yellow',
  },
} as const

export type IncludePresetsReturn<T extends AnyFunction> = Record<
  keyof typeof defaultPresets,
  ReturnType<T>
>

export function includePresets<T extends FunctionType<[any], any>>(
  fn: T,
): IncludePresetsReturn<T> {
  const presetsFromTheme = {}

  for (const [key, value] of Object.entries(defaultPresets)) {
    presetsFromTheme[key] = fn(value)
  }

  return presetsFromTheme as IncludePresetsReturn<T>
}
