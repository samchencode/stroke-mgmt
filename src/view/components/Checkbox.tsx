import React, { useCallback } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native-gesture-handler';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

function Checkbox({ value, onChange, style = {} }: Props) {
  const handlePress = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);
  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {value ? (
        <FontAwesome5 name="check-square" size={24} />
      ) : (
        <FontAwesome5 name="square" size={24} />
      )}
    </TouchableOpacity>
  );
}

export { Checkbox };
