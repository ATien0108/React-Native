import {View, Text, Button} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}: any) => {
  const handleLogout = async () => {
    // Xóa token trong AsyncStorage
    await AsyncStorage.clear();

    // Điều hướng về màn hình LoginScreen
    navigation.navigate('LoginScreen'); // Hoặc dùng navigation.reset() nếu muốn reset tất cả các màn hình
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>HomeScreen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeScreen;
