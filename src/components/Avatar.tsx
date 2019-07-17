import React from 'react';
import { Image, ImageProps } from 'react-native';

type Props = ImageProps & {
  size: number;
};

export default function Avatar(props: Props) {
  let { size, style, ...otherProps } = props;
  let imageSize = { width: size, height: size, borderRadius: size / 2 };
  return <Image style={[imageSize, style]} {...otherProps} />;
}
