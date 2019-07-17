import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

type Props = ImageProps & {
  aspectRatio: number;
};

export default function FixedRatioImage(props: Props) {
  let { aspectRatio, style, ...otherProps } = props;
  let ratio = { aspectRatio };
  return <Image style={[styles.image, ratio, style]} {...otherProps} />;
}

let styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
  },
});
