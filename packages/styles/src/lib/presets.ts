import { ICSS } from '../types'

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
  relative: {
    position: 'relative',
  },
  fixed: {
    position: 'fixed',
  },
  sticky: {
    position: 'sticky',
  },
  inset: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  insetX: {
    left: 0,
    right: 0,
  },
  insetY: {
    top: 0,
    bottom: 0,
  },
  top: {
    top: 0,
  },
  right: {
    right: 0,
  },
  bottom: {
    bottom: 0,
  },
  left: {
    left: 0,
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
  alignStretch: {
    alignItems: 'stretch',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  alignSelfStretch: {
    alignSelf: 'stretch',
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
    backgroundColor: '#f00',
  },
  debGreen: {
    backgroundColor: '#0f0',
  },
  debBlue: {
    backgroundColor: '#00f',
  },
  debYellow: {
    backgroundColor: '#f9e902',
  },
} as const

export type DefaultPresets = Record<
  keyof typeof defaultPresets,
  ICSS
>
