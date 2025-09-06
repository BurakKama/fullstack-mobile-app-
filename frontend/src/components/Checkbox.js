import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

export default function CheckBox({ label, value, onValueChange }) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: value ? '#D32F2F' : 'transparent',
        marginRight: 0.5,
      }} />
      <Text>{label}</Text>
    </Pressable>
  );
}
