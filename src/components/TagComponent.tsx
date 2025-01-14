import React, {ReactNode} from 'react';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '../constants/appColors';

interface Props {
  icon?: ReactNode;
  title: string;
  isFill?: boolean;
  color?: string;
}

const TagComponent = (props: Props) => {
  const {icon, color, isFill, title} = props;

  // Xử lý màu nền và màu chữ dựa trên isFill
  const backgroundColor = isFill ? color ?? appColors.primary : 'transparent';
  const textColor = isFill ? appColors.white : color ?? appColors.primary;

  return (
    <RowComponent
      styles={{
        backgroundColor: backgroundColor,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
      }}>
      {icon && icon}
      <TextComponent text={title} color={textColor} size={14} />
    </RowComponent>
  );
};

export default TagComponent;
