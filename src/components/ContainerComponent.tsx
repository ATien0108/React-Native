import {useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'iconsax-react-native'; // Sửa dấu ngoặc đơn
import React, {ReactNode} from 'react'; // Sửa dấu ngoặc đơn
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {appColors} from '../constants/appColors'; // Sửa dấu ngoặc đơn
import {fontFamilies} from '../constants/fontFamilies';
import {globalStyles} from '../styles/globalStyles'; // Sửa dấu ngoặc đơn

interface Props {
  isImageBackground?: boolean; // Sửa cú pháp
  isScroll?: boolean; // Sửa cú pháp
  title?: string;
  children: ReactNode;
  back?: boolean;
}

const ContainerComponent = (props: Props) => {
  const {children, isScroll, isImageBackground, title, back} = props; // Sửa dấu ngoặc vuông thành ngoặc nhọn
  const navigation: any = useNavigation(); // Thêm dấu "=" sau "navigation"

  const headerComponent = () => {
    return (
      <View style={{flex: 1, paddingTop: 30}}>
        {(title || back) && (
          <RowComponent
            styles={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              minWidth: 48, // Sửa 'minwidth' thành 'minWidth'
              minHeight: 48,
              justifyContent: 'flex-start',
            }}>
            {back && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginRight: 12}}>
                <ArrowLeft size={24} color={appColors.text} />
              </TouchableOpacity>
            )}
            {title ? (
              <TextComponent
                text={title}
                size={16}
                font={fontFamilies.medium}
                flex={1}
              />
            ) : (
              <></>
            )}
          </RowComponent>
        )}
      </View>
    );
  };

  const returnContainer = isScroll ? (
    <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={{flex: 1}}>{children}</View>
  );

  return isImageBackground ? (
    <ImageBackground
      source={require('../assets/images/splash-img.png')}
      style={{flex: 1}}
      imageStyle={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        {headerComponent()}
        {returnContainer}
      </SafeAreaView>
    </ImageBackground>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View>{headerComponent()}</View>
      {returnContainer}
    </SafeAreaView>
  );
};

export default ContainerComponent;
