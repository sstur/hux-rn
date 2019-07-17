import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function FeedCard(props: Props) {
  let { children } = props;
  return (
    <View style={styles.card}>
      <View style={styles.cardInner}>{children}</View>
    </View>
  );
}

let shadowStyle = Platform.select({
  android: {
    elevation: 4,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
});

let styles = StyleSheet.create({
  card: {
    paddingBottom: 16,
  },
  cardInner: {
    ...shadowStyle,
    backgroundColor: 'white',
  },
});
