import {View} from 'react-native';
import React from 'react';

interface Props {
  width?: number;
  height?: number;
}

const SpaceComponent: React.FC<Props> = ({width = 0, height = 0}) => {
  return (
    <View
      style={{
        width,
        height,
      }}
    />
  );
};

export default SpaceComponent;
