import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
}

const SectionComponent = (props: Props) => {
  const {children, styles} = props; // Sửa lại dấu ngoặc đơn cho đúng cú pháp
  return <View style={[globalStyles.section, styles]}>{children}</View>; // Sửa 'view' thành 'View' để tránh lỗi
};

export default SectionComponent;
