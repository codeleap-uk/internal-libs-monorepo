/* eslint-disable max-lines */
/* @flow */

import React from 'react'
import PropTypes from 'prop-types'
import {
  Keyboard,
  Platform,
  UIManager,
  TextInput,
  findNodeHandle,
  Animated,
  Dimensions,
  KeyboardEventName,
  EventSubscription,
  KeyboardEventListener,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import type { KeyboardAwareInterface } from './KeyboardAwareInterface'
export function isIphoneX() {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTV &&
      ((dimen.height === 780 || dimen.width === 780)
        || (dimen.height === 812 || dimen.width === 812)
        || (dimen.height === 844 || dimen.width === 844)
        || (dimen.height === 896 || dimen.width === 896)
        || (dimen.height === 926 || dimen.width === 926))
  )
}

const _KAM_DEFAULT_TAB_BAR_HEIGHT: number = isIphoneX() ? 83 : 49
const _KAM_KEYBOARD_OPENING_TIME = 250
const _KAM_EXTRA_HEIGHT = 75

const supportedKeyboardEvents: KeyboardEventName[] = [
  'keyboardWillShow',
  'keyboardDidShow',
  'keyboardWillHide',
  'keyboardDidHide',
  'keyboardWillChangeFrame',
  'keyboardDidChangeFrame',
]
const keyboardEventToCallbackName = (eventName: string) => 'on' + eventName[0].toUpperCase() + eventName.substring(1)
const keyboardEventPropTypes = supportedKeyboardEvents.reduce(
  (acc: Object, eventName: string) => ({
    ...acc,
    [keyboardEventToCallbackName(eventName)]: PropTypes.func,
  }),
  {},
)
const keyboardAwareHOCTypeEvents = supportedKeyboardEvents.reduce(
  (acc: Object, eventName: string) => ({
    ...acc,
    [keyboardEventToCallbackName(eventName)]: Function,
  }),
  {},
)

export type KeyboardAwareHOCProps = {
  viewIsInsideTabBar?: boolean
  resetScrollToCoords?: {
    x: number
    y: number
  }
  enableResetScrollToCoords?: boolean
  enableAutomaticScroll?: boolean
  extraHeight?: number
  extraScrollHeight?: number
  keyboardOpeningTime?: number
  onScroll?: Function
  update?: Function
  contentContainerStyle?: any
  enableOnAndroid?: boolean
  Scrollable: any
  innerRef?: Function
  hocOptions?: any
} & typeof keyboardAwareHOCTypeEvents
export type KeyboardAwareHOCState = {
  keyboardSpace: number
}

export type ElementLayout = {
  x: number
  y: number
  width: number
  height: number
}

export type ContentOffset = {
  x: number
  y: number
}

export type ScrollPosition = {
  x: number
  y: number
  animated: boolean
}

export type ScrollIntoViewOptions = {
  getScrollPosition?: (
    parentLayout: ElementLayout,
    childLayout: ElementLayout,
    contentOffset: ContentOffset
  ) => ScrollPosition
}

export type KeyboardAwareHOCOptions = {
  enableOnAndroid: boolean
  contentContainerStyle?: Object
  enableAutomaticScroll: boolean
  extraHeight: number
  extraScrollHeight: number
  enableResetScrollToCoords: boolean
  keyboardOpeningTime: number
  viewIsInsideTabBar: boolean
  refPropName: string
  extractNativeRef: Function
}

function getDisplayName(WrappedComponent: React.ComponentClass) {
  return (
    (WrappedComponent &&
      (WrappedComponent.displayName || WrappedComponent.name)) ||
    'Component'
  )
}

const ScrollIntoViewDefaultOptions: KeyboardAwareHOCOptions = {
  enableOnAndroid: false,
  contentContainerStyle: undefined,
  enableAutomaticScroll: true,
  extraHeight: _KAM_EXTRA_HEIGHT,
  extraScrollHeight: 0,
  enableResetScrollToCoords: true,
  keyboardOpeningTime: _KAM_KEYBOARD_OPENING_TIME,
  viewIsInsideTabBar: false,

  // The ref prop name that will be passed to the wrapped component to obtain a ref
  // If your ScrollView is already wrapped, maybe the wrapper permit to get a ref
  // For example, with glamorous-native ScrollView, you should use "innerRef"
  refPropName: 'ref',
  // Sometimes the ref you get is a ref to a wrapped view (ex: Animated.ScrollView)
  // We need access to the imperative API of a real native ScrollView so we need extraction logic
  extractNativeRef: (ref: any) => {
    // getNode() permit to support Animated.ScrollView automatically, but is deprecated since RN 0.62
    // see https://github.com/facebook/react-native/issues/19650
    // see https://stackoverflow.com/questions/42051368/scrollto-is-undefined-on-animated-scrollview/48786374
    // see https://github.com/facebook/react-native/commit/66e72bb4e00aafbcb9f450ed5db261d98f99f82a
    const shouldCallGetNode = !Platform.constants || (Platform.constants.reactNativeVersion.major === 0 && Platform.constants.reactNativeVersion.minor < 62)
    if (ref.getNode && shouldCallGetNode) {
      return ref.getNode()
    } else {
      return ref
    }
  },
}

class KeyboardAwareScrollable extends React.Component<KeyboardAwareHOCProps, KeyboardAwareHOCState> implements KeyboardAwareInterface {
    _rnkasv_keyboardView: any

    keyboardWillShowEvent: EventSubscription

    keyboardWillHideEvent: EventSubscription

    position: ContentOffset

    defaultResetScrollToCoords?: { x: number; y: number }

    mountedComponent: boolean

    handleOnScroll: Function

    callbacks: Record<string, EventSubscription>

    state: KeyboardAwareHOCState

    static displayName = `KeyboardAware`

    static propTypes = {
      viewIsInsideTabBar: PropTypes.bool,
      resetScrollToCoords: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }),
      enableResetScrollToCoords: PropTypes.bool,
      enableAutomaticScroll: PropTypes.bool,
      extraHeight: PropTypes.number,
      extraScrollHeight: PropTypes.number,
      keyboardOpeningTime: PropTypes.number,
      onScroll: PropTypes.oneOfType([
        PropTypes.func, // Normal listener
        PropTypes.object, // Animated.event listener
      ]),
      update: PropTypes.func,
      contentContainerStyle: PropTypes.any,
      enableOnAndroid: PropTypes.bool,
      innerRef: PropTypes.func,
      ...keyboardEventPropTypes,
    }

    // HOC options are used to init default props, so that these options can be overriden with component props
    static defaultProps = {
      enableAutomaticScroll: ScrollIntoViewDefaultOptions.enableAutomaticScroll,
      extraHeight: ScrollIntoViewDefaultOptions.extraHeight,
      extraScrollHeight: ScrollIntoViewDefaultOptions.extraScrollHeight,
      enableResetScrollToCoords: ScrollIntoViewDefaultOptions.enableResetScrollToCoords,
      keyboardOpeningTime: ScrollIntoViewDefaultOptions.keyboardOpeningTime,
      viewIsInsideTabBar: ScrollIntoViewDefaultOptions.viewIsInsideTabBar,
      enableOnAndroid: ScrollIntoViewDefaultOptions.enableOnAndroid,
    }

    constructor(props: KeyboardAwareHOCProps) {
      super(props)
      this.keyboardWillShowEvent = undefined
      this.keyboardWillHideEvent = undefined
      this.callbacks = {}
      this.position = { x: 0, y: 0 }
      this.defaultResetScrollToCoords = null
      const keyboardSpace: number = props.viewIsInsideTabBar
        ? _KAM_DEFAULT_TAB_BAR_HEIGHT
        : 0
      this.state = { keyboardSpace }
    }

    componentDidMount() {
      this.mountedComponent = true
      // Keyboard events
      if (Platform.OS === 'ios') {
        this.keyboardWillShowEvent = Keyboard.addListener(
          'keyboardWillShow',
          this._updateKeyboardSpace,
        )
        this.keyboardWillHideEvent = Keyboard.addListener(
          'keyboardWillHide',
          this._resetKeyboardSpace,
        )
      } else if (Platform.OS === 'android' && this.props.enableOnAndroid) {
        this.keyboardWillShowEvent = Keyboard.addListener(
          'keyboardDidShow',
          this._updateKeyboardSpace,
        )
        this.keyboardWillHideEvent = Keyboard.addListener(
          'keyboardDidHide',
          this._resetKeyboardSpace,
        )
      }

      supportedKeyboardEvents.forEach((eventName) => {
        const callbackName = keyboardEventToCallbackName(eventName)
        if (this.props[callbackName]) {
          this.callbacks[eventName] = Keyboard.addListener(
            eventName,
            this.props[callbackName],
          )
        }
      })
    }

    componentDidUpdate(prevProps: KeyboardAwareHOCProps) {
      if (this.props.viewIsInsideTabBar !== prevProps.viewIsInsideTabBar) {
        const keyboardSpace: number = this.props.viewIsInsideTabBar
          ? _KAM_DEFAULT_TAB_BAR_HEIGHT
          : 0
        if (this.state.keyboardSpace !== keyboardSpace) {
          this.setState({ keyboardSpace })
        }
      }
    }

    componentWillUnmount() {
      this.mountedComponent = false
      this.keyboardWillShowEvent && this.keyboardWillShowEvent.remove()
      this.keyboardWillHideEvent && this.keyboardWillHideEvent.remove()
      Object.values(this.callbacks).forEach((callback) => callback.remove(),
      )
    }

    getScrollResponder = () => {
      return (
        this._rnkasv_keyboardView &&
        this._rnkasv_keyboardView.getScrollResponder &&
        this._rnkasv_keyboardView.getScrollResponder()
      )
    }

    scrollToPosition = (x: number, y: number, animated = true) => {
      const responder = this.getScrollResponder()
      if (!responder) {
        return
      }
      if (responder.scrollResponderScrollTo) {
        // React Native < 0.65
        responder.scrollResponderScrollTo({ x, y, animated })
      } else if (responder.scrollTo) {
        // React Native >= 0.65
        responder.scrollTo({ x, y, animated })
      }
    }

    scrollToEnd = (animated = true) => {
      const responder = this.getScrollResponder()
      if (!responder) {
        return
      }
      if (responder.scrollResponderScrollToEnd) {
        // React Native < 0.65
        responder.scrollResponderScrollToEnd({ animated })
      } else if (responder.scrollToEnd) {
        // React Native >= 0.65
        responder.scrollToEnd({ animated })
      }
    }

    scrollForExtraHeightOnAndroid = (extraHeight: number) => {
      this.scrollToPosition(0, this.position.y + extraHeight, true)
    }

    /**
     * @param keyboardOpeningTime: takes a different keyboardOpeningTime in consideration.
     * @param extraHeight: takes an extra height in consideration.
     */
    scrollToFocusedInput = (
      reactNode: any,
      extraHeight?: number,
      keyboardOpeningTime?: number,
    ) => {
      if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight || 0
      }
      if (keyboardOpeningTime === undefined) {
        keyboardOpeningTime = this.props.keyboardOpeningTime || 0
      }
      setTimeout(() => {
        if (!this.mountedComponent) {
          return
        }
        const responder = this.getScrollResponder()
        responder &&
          responder.scrollResponderScrollNativeHandleToKeyboard(
            reactNode,
            extraHeight,
            true,
          )
      }, keyboardOpeningTime)
    }

    scrollIntoView = async (
      element: React.ComponentClass,
      options: ScrollIntoViewOptions = {},
    ) => {
      if (!this._rnkasv_keyboardView || !element) {
        return
      }

      const [parentLayout, childLayout] = await Promise.all([
        this._measureElement(this._rnkasv_keyboardView),
        this._measureElement(element),
      ])

      const getScrollPosition =
        options.getScrollPosition || this._defaultGetScrollPosition
      const { x, y, animated } = getScrollPosition(
        parentLayout,
        childLayout,
        this.position,
      )
      this.scrollToPosition(x, y, animated)
    }

    _defaultGetScrollPosition = (
      parentLayout: ElementLayout,
      childLayout: ElementLayout,
      contentOffset: ContentOffset,
    ): ScrollPosition => {
      return {
        x: 0,
        y: Math.max(0, childLayout.y - parentLayout.y + contentOffset.y),
        animated: true,
      }
    }

    _measureElement = (element: React.ComponentClass): Promise<ElementLayout> => {
      const node = findNodeHandle(element)

      return new Promise((resolve: (el: ElementLayout) => void) => {
        UIManager.measureInWindow(
          node,
          (x: number, y: number, width: number, height: number) => {
            resolve({ x, y, width, height })
          },
        )
      })
    }

    // Keyboard actions
    _updateKeyboardSpace = (frames: Parameters<KeyboardEventListener>['0']) => {
      // Automatically scroll to focused TextInput
      if (this.props.enableAutomaticScroll) {
        let keyboardSpace: number =
          frames.endCoordinates.height + this.props.extraScrollHeight
        if (this.props.viewIsInsideTabBar) {
          keyboardSpace -= _KAM_DEFAULT_TAB_BAR_HEIGHT
        }
        this.setState({ keyboardSpace })
        const currentlyFocusedField = TextInput.State.currentlyFocusedInput ?
          findNodeHandle(TextInput.State.currentlyFocusedInput()) : TextInput.State.currentlyFocusedField()
        const responder = this.getScrollResponder()
        if (!currentlyFocusedField || !responder) {
          return
        }
        // @ts-ignore
        UIManager.viewIsDescendantOf(
          currentlyFocusedField,
          responder.getInnerViewNode(),
          (isAncestor: boolean) => {
            if (isAncestor) {
              // Check if the TextInput will be hidden by the keyboard
              UIManager.measureInWindow(
                currentlyFocusedField,
                (x: number, y: number, width: number, height: number) => {
                  const textInputBottomPosition = y + height
                  const keyboardPosition = frames.endCoordinates.screenY
                  const totalExtraHeight =
                    this.props.extraScrollHeight + this.props.extraHeight
                  if (Platform.OS === 'ios') {
                    if (
                      textInputBottomPosition >
                      keyboardPosition - totalExtraHeight
                    ) {
                      this._scrollToFocusedInputWithNodeHandle(
                        currentlyFocusedField,
                      )
                    }
                  } else {
                    // On android, the system would scroll the text input just
                    // above the keyboard so we just neet to scroll the extra
                    // height part
                    if (textInputBottomPosition > keyboardPosition) {
                      // Since the system already scrolled the whole view up
                      // we should reduce that amount
                      keyboardSpace =
                        keyboardSpace -
                        (textInputBottomPosition - keyboardPosition)
                      this.setState({ keyboardSpace })
                      this.scrollForExtraHeightOnAndroid(totalExtraHeight)
                    } else if (
                      textInputBottomPosition >
                      keyboardPosition - totalExtraHeight
                    ) {
                      this.scrollForExtraHeightOnAndroid(
                        totalExtraHeight -
                          (keyboardPosition - textInputBottomPosition),
                      )
                    }
                  }
                },
              )
            }
          },
        )
      }
      if (!this.props.resetScrollToCoords) {
        if (!this.defaultResetScrollToCoords) {
          this.defaultResetScrollToCoords = this.position
        }
      }
    }

    _resetKeyboardSpace = () => {
      const keyboardSpace: number = this.props.viewIsInsideTabBar
        ? _KAM_DEFAULT_TAB_BAR_HEIGHT
        : 0
      this.setState({ keyboardSpace })
      // Reset scroll position after keyboard dismissal
      if (this.props.enableResetScrollToCoords === false) {
        this.defaultResetScrollToCoords = null
        return
      } else if (this.props.resetScrollToCoords) {
        this.scrollToPosition(
          this.props.resetScrollToCoords.x,
          this.props.resetScrollToCoords.y,
          true,
        )
      } else {
        if (this.defaultResetScrollToCoords) {
          this.scrollToPosition(
            this.defaultResetScrollToCoords.x,
            this.defaultResetScrollToCoords.y,
            true,
          )
          this.defaultResetScrollToCoords = null
        } else {
          this.scrollToPosition(0, 0, true)
        }
      }
    }

    _scrollToFocusedInputWithNodeHandle = (
      nodeID: number,
      extraHeight?: number,
      keyboardOpeningTime?: number,
    ) => {
      if (extraHeight === undefined) {
        extraHeight = this.props.extraHeight
      }
      const reactNode = findNodeHandle(nodeID)
      this.scrollToFocusedInput(
        reactNode,
        extraHeight + this.props.extraScrollHeight,
        keyboardOpeningTime !== undefined
          ? keyboardOpeningTime
          : this.props.keyboardOpeningTime || 0,
      )
    }

    _handleOnScroll = (
      e: NativeSyntheticEvent<any> & { nativeEvent: { contentOffset: number } },
    ) => {
      this.position = e.nativeEvent.contentOffset
    }

    _handleRef = (ref: React.ComponentClass<any>) => {
      this._rnkasv_keyboardView = ref ? this.props.hocOptions.extractNativeRef(ref) : ref
      if (this.props.innerRef) {
        this.props.innerRef(this._rnkasv_keyboardView)
      }
    }

    update = () => {
      const currentlyFocusedField = TextInput.State.currentlyFocusedInput ?
        findNodeHandle(TextInput.State.currentlyFocusedInput()) : TextInput.State.currentlyFocusedField()
      const responder = this.getScrollResponder()

      if (!currentlyFocusedField || !responder) {
        return
      }

      this._scrollToFocusedInputWithNodeHandle(currentlyFocusedField)
    }

    render() {
      const { enableOnAndroid, contentContainerStyle, onScroll, Scrollable } = this.props
      let newContentContainerStyle
      if (Platform.OS === 'android' && enableOnAndroid) {
        newContentContainerStyle = [].concat(contentContainerStyle).concat({
          paddingBottom:
            ((contentContainerStyle || {}).paddingBottom || 0) +
            this.state.keyboardSpace,
        })
      }
      const refProps = { [this.props.hocOptions.refPropName]: this._handleRef }
      return (
        <Scrollable
          {...refProps}
          keyboardDismissMode='interactive'
          contentInset={{ bottom: this.state.keyboardSpace }}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={true}
          scrollEventThrottle={1}
          {...this.props}
          contentContainerStyle={
            newContentContainerStyle || contentContainerStyle
          }
          keyboardSpace={this.state.keyboardSpace}
          getScrollResponder={this.getScrollResponder}
          scrollToPosition={this.scrollToPosition}
          scrollToEnd={this.scrollToEnd}
          scrollForExtraHeightOnAndroid={this.scrollForExtraHeightOnAndroid}
          scrollToFocusedInput={this.scrollToFocusedInput}
          scrollIntoView={this.scrollIntoView}
          resetKeyboardSpace={this._resetKeyboardSpace}
          handleOnScroll={this._handleOnScroll}
          update={this.update}
          // @ts-ignore
          onScroll={Animated.forkEvent(onScroll, this._handleOnScroll)}
        />
      )
    }
}

function KeyboardAwareHOC(
  ScrollableComponent: React.ComponentClass<any>,
  userOptions = ScrollIntoViewDefaultOptions,
) {

  const hocOptions: KeyboardAwareHOCOptions = {
    ...ScrollIntoViewDefaultOptions,
    ...userOptions,
  }

  return React.forwardRef((props, ref) => <KeyboardAwareScrollable
    hocOptions={hocOptions}
    // @ts-ignore
    ref={ref}
    Scrollable={ScrollableComponent}
    {...props}
  />)
}

// Allow to pass options, without breaking change, and curried for composition
// listenToKeyboardEvents(ScrollView);
// listenToKeyboardEvents(options)(Comp);
const listenToKeyboardEvents = <C extends React.ComponentType | React.ComponentClass>(configOrComp: C) => {
  //@ts-ignore
  if (typeof configOrComp === 'object' && !configOrComp.displayName) {
    return ((Comp: Function) => KeyboardAwareHOC(Comp as React.ComponentClass, configOrComp)) as unknown as C
  } else {
    //@ts-ignore
    return KeyboardAwareHOC(configOrComp) as C
  }
}

export default listenToKeyboardEvents
