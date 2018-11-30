import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ height: 80 }}>
      <Text>{item.id}</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
    </TouchableOpacity>
  );
};
