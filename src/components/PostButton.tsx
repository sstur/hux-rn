import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';

import Text from '../components/Text';

type Props = {
  icon: string;
  iconColor: string;
  text: string;
  onPress: () => void;
};

function PostButton(props: Props) {
  let { icon, iconColor, text, onPress } = props;
  return (
    <TouchableRipple
      style={styles.button}
      rippleColor="rgba(0, 0, 0, .32)"
      onPress={onPress}
    >
      <View style={styles.buttonInner}>
        <Icon name={icon} size={23} color={iconColor} />
        <Text fontStyle="alt" style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableRipple>
  );
}

let styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonText: {
    fontSize: 17,
    marginLeft: 10,
  },
});

export default PostButton;
