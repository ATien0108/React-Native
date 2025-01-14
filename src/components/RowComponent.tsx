import React, {ReactNode} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  justify?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
  styles?: StyleProp<ViewStyle>;
  children: ReactNode;
  onPress?: () => void;
}

const RowComponent = (props: Props) => {
  // Sửa dấu ngoặc đơn trong khai báo hàm
  const {styles, justify, children, onPress} = props; // Sửa dấu ngoặc vuông thành ngoặc nhọn
  const localStyle = [
    globalStyles.row,
    {
      justifyContent: justify ?? 'center',
    },
    styles,
  ];

  return onPress ? (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={localStyle}>
      {children} {/* Sửa lỗi phần children để hiển thị đúng */}
    </TouchableOpacity>
  ) : (
    <View style={localStyle}>{children}</View>
  );
};

export default RowComponent;
