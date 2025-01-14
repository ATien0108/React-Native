import React, {useEffect, useState} from 'react';
import {SplashScreen} from './src/screens'; // Correct import syntax
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './src/navigators/AuthNavigator';
import MainNavigator from './src/navigators/MainNavigator';
import {StatusBar} from 'react-native'; // Correct import syntax
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage trực tiếp

const App = () => {
  // sử dụng useState để lưu thời gian 1.5 giây
  const [isShowSplash, setIsShowSplash] = useState(true);
  // muốn lưu liền thì dùng store redux toolkit
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowSplash(false);
    }, 1500);
    return () => clearTimeout(timeout); // Fix setTimeout cleanup
  }, []);

  // chạy 01 lần thì dùng useEffect không tham số []
  useEffect(() => {
    checkLogin();
  }, []);

  // Khu vực các hàm
  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('assetToken'); // Sử dụng AsyncStorage trực tiếp
      console.log('Token:', token);
      if (token) {
        setAccessToken(token);
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  // dùng dấu ! để phủ định điều kiện
  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={'transparent'}
      />
      {!isShowSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          {/* Kiểm tra token nếu có thì trả về Main không thì trả về Auth */}
          {accessToken ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      )}
    </>
  );
};

export default App;
