import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default ({ playing, onStart, onStop }) => {
  const onPress = playing ? onStop : onStart;
  const iconName = playing ? 'ios-pause' : 'ios-play';

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Icon name={iconName} size={24} color="#0087FF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
