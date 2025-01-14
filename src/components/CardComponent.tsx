import {View, Text, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {appColors} from '../constants/appColors';

interface Props {
  children: ReactNode;
  bgcolor?: string;
  styles?: StyleProp<ViewStyle>;
}

const CardComponent = (props: Props) => {
  const {children, bgcolor, styles} = props; // Sửa tên biến bgColor thành bgcolor để đồng nhất
  return (
    <TouchableOpacity
      style={[
        globalStyles.shadow,
        globalStyles.card,
        {
          backgroundColor: bgcolor ?? appColors.white, // Sửa tên biến từ bgColor thành bgcolor
        },
        styles,
      ]}>
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;
