import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import axios from 'axios';
import {
  ContainerComponent,
  InputComponent,
  ButtonComponent,
  SpaceComponent,
  TextComponent,
  SectionComponent,
} from '../../components';
import {Image} from 'react-native';

const ForgotPasswordScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');

  // Gửi OTP tới email
  const handleSendOtp = async () => {
    try {
      // Send the email as a query parameter
      const response = await axios.post(
        `http://10.0.2.2:8088/api/users/forgot-password?email=${email}`,
      );
      if (response.data === 'OTP has been sent to your email.') {
        Alert.alert(
          'OTP Sent',
          'Check your email for the OTP.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('ResetPasswordScreen', {email}),
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert('Error', response.data); // If email is not found
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'An error occurred while sending OTP.');
    }
  };

  return (
    <ContainerComponent isScroll>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/images/text-logo.png')}
          style={{
            width: 162,
            height: 114,
            marginBottom: 30,
          }}
        />
      </SectionComponent>
      <SectionComponent>
        <TextComponent size={24} title text="Quên mật khẩu" />
        <SpaceComponent height={20} />
        <InputComponent
          value={email}
          placeholder="Nhập email"
          onChange={setEmail}
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          text="Gửi OTP"
          onPress={handleSendOtp}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ForgotPasswordScreen;
