import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

import Avatar from './Avatar';
import { User } from '../types/types';

type Props = {
  user: User;
  onSubmit: (text: string) => void;
  isSubmitting: boolean;
};

export default function CommentForm(props: Props) {
  let { user, onSubmit, isSubmitting } = props;
  let [text, setText] = useState('');
  let submit = () => {
    onSubmit(text);
    setText('');
  };
  return (
    <View style={styles.form}>
      <Avatar
        size={40}
        style={styles.avatar}
        source={{
          uri:
            user.photo ||
            'https://s.gravatar.com/avatar/135b97b3a34ac25525544cd1df930c84?s=256',
        }}
      />
      <TextInput
        placeholder="Write a comment"
        value={text}
        style={styles.textInput}
        underlineColor="rgba(0, 0, 0, 0)"
        returnKeyType="send"
        onChangeText={(value) => setText(value)}
        onSubmitEditing={submit}
      />
      <Button
        color="black"
        onPress={submit}
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        SEND
      </Button>
    </View>
  );
}

let styles = StyleSheet.create({
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#eee',
    paddingVertical: 8,
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    margin: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {},
});
