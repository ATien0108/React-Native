import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import axios from 'axios'; // Để gọi API
import {
  InputComponent,
  ButtonComponent,
  SpaceComponent,
  TextComponent,
  SectionComponent,
  ContainerComponent,
} from '../../components';
import {Image, Switch} from 'react-native';

const OtpVerifyResetPasswordScreen = ({navigation, route}: any) => {
  const {email} = route.params; // Lấy email đã đăng ký từ params
  const [otp, setOtp] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);

  // Hàm kiểm tra OTP hợp lệ (giả định OTP có 6 ký tự)
  const handleOtpValidation = () => {
    setIsOtpValid(otp.length === 6);
  };

  const handleOtpSubmit = async () => {
    // Kiểm tra OTP hợp lệ
    handleOtpValidation();

    if (isOtpValid) {
      try {
        const response = await axios.post(
          'http://10.0.2.2:8088/api/users/verify-otp',
          null,
          {
            params: {
              email,
              otp,
            },
          },
        );

        if (response.data === 'OTP verified successfully.') {
          Alert.alert(
            'Registration Successful',
            'Your registration is complete.',
          );
          navigation.navigate('LoginScreen'); // Chuyển sang màn hình đăng nhập
        } else {
          Alert.alert('Verification Failed', response.data); // Hiển thị thông báo lỗi
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        Alert.alert('Error', 'An error occurred, please try again later.');
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid OTP.');
    }
  };

  return (
    <ContainerComponent>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 75,
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
        <TextComponent size={24} title text="Enter OTP" />
        <SpaceComponent height={20} />

        <InputComponent
          value={otp}
          placeholder="Enter OTP"
          onChange={setOtp}
          keyboardType="number-pad" // Bàn phím chỉ nhập số
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          onPress={handleOtpSubmit} // Gọi hàm đăng nhập
          text="XÁC THỰC OTP"
          type="primary"
          disable={!otp}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  buttonSection: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    backgroundColor: '#B0B0B0',
    borderRadius: 5,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OtpVerifyResetPasswordScreen;
