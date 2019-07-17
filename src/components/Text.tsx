import React from 'react';
import { Text as TextRaw, TextProps, StyleSheet } from 'react-native';
import {
  FONT_REGULAR,
  FONT_BOLD,
  FONT_ALT,
  FONT_ALT_BOLD,
} from '../theme/constants';

type Props = TextProps & {
  children: React.ReactNode;
  fontStyle?: 'normal' | 'alt';
  fontWeight?: 'regular' | 'bold';
};

export default function Text(props: Props) {
  let { style, fontStyle, fontWeight, ...otherProps } = props;
  let fontFamilyStyle;
  if (fontStyle === 'alt') {
    fontFamilyStyle = fontWeight === 'bold' ? styles.altBold : styles.alt;
  } else {
    fontFamilyStyle = fontWeight === 'bold' ? styles.bold : styles.regular;
  }
  return (
    <TextRaw
      style={[styles.normalSize, fontFamilyStyle, style]}
      {...otherProps}
    />
  );
}

let styles = StyleSheet.create({
  // TODO: Move these to a theme file.
  normalSize: {
    fontSize: 16,
  },
  regular: {
    fontFamily: FONT_REGULAR,
  },
  bold: {
    fontFamily: FONT_BOLD,
  },
  alt: {
    fontFamily: FONT_ALT,
  },
  altBold: {
    fontFamily: FONT_ALT_BOLD,
  },
});
