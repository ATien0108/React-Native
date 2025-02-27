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

const ResetPasswordScreen = ({route, navigation}: any) => {
  const {email} = route.params; // Nhận email từ màn hình trước
  const [enteredEmail, setEnteredEmail] = useState(email); // The email input that shows the email from the previous screen
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Reset mật khẩu khi có OTP hợp lệ
  const handleResetPassword = async () => {
    try {
      // Pass email, newPassword, and OTP as query parameters in the URL
      const response = await axios.post(
        `http://10.0.2.2:8088/api/users/reset-password?email=${enteredEmail}&newPassword=${newPassword}&otp=${otp}`,
      );
      if (response.data === 'Password reset successfully.') {
        Alert.alert('Success', 'Your password has been reset successfully.');
        navigation.navigate('LoginScreen'); // Navigate back to the login screen
      } else {
        Alert.alert('Error', response.data); // If OTP is invalid or expired
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Alert.alert('Error', 'An error occurred while resetting the password.');
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
        <TextComponent size={24} title text="Reset Password" />
        <SpaceComponent height={20} />
        <InputComponent
          value={enteredEmail}
          placeholder="Email"
          onChange={setEnteredEmail} // Allow the user to modify email if necessary
          editable={false} // Set it as non-editable if you don't want users to change it
        />

        <InputComponent value={otp} placeholder="Enter OTP" onChange={setOtp} />
        <InputComponent
          value={newPassword}
          placeholder="New Password"
          onChange={setNewPassword}
          isPassword
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          text="Reset Password"
          onPress={handleResetPassword}
          type="primary"
          disable={!newPassword || !otp} // Disable the button if OTP or newPassword is missing
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ResetPasswordScreen;
