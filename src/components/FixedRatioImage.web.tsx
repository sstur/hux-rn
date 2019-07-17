import React from 'react';
import { Image, ImageProps } from 'react-native';

type Props = ImageProps & {
  aspectRatio: number;
};

export default function FixedRatioImage(props: Props) {
  let { aspectRatio, style, ...otherProps } = props;
  let padding = (Math.round((1 / aspectRatio) * 1000) / 10).toString() + '%';
  return <Image style={[style, { paddingBottom: padding }]} {...otherProps} />;
}
