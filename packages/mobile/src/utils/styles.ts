import { useStyle } from '@codeleap/common';
import { StyleSheet } from 'react-native';

export function useLogStyles() {
  const { logger } = useStyle();

  return (name, styles) => {
    logger.debug.blue(
      name,
      JSON.stringify(StyleSheet.flatten(styles), null, 2),
      'Component Styles',
    );
  };
}
