import { ICSS } from '../types'

export const defaultVariants = {
  block: {
    display: 'block',
  },
  flex: {
    display: 'flex',
    flex: 1,
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
  insetX: {
    left: 0,
    right: 0,
  },
  insetY: {
    top: 0,
    bottom: 0,
  },
  hidden: {
    display: 'none',
  },
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
  wrap: {
    flexWrap: 'wrap',
  },
} as const

export type DefaultVariants = Record<keyof typeof defaultVariants, ICSS>
