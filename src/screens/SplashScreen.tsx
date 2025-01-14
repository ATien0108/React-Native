import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {appInfo} from '../constants/appInfos';
import {appColors} from '../constants/appColors';
import {SpaceComponent} from '../components';

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('../assets/images/splash-img.png')}
      style={styles.container}
      imageStyle={styles.backgroundImage}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <SpaceComponent height={16} />
      <ActivityIndicator color={appColors.gray} size={22} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
  },
  logo: {
    width: appInfo.sizes.WIDTH * 0.7,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
