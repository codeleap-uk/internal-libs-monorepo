import {
  Animated,
} from 'react-native';

export type PressableRippleProps = {
  rippleColor?: string;
  rippleOpacity?: number;
  rippleDuration?: number;
  rippleSize?: number;
  rippleCentered?: boolean;
  rippleSequential?: boolean;
  rippleFades?: boolean;
  color?: string
  onRippleAnimation?: (
    animation: Animated.CompositeAnimation,
    callback: () => void,
  ) => void;
}
