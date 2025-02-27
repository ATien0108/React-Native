import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import axios from 'axios'; // Thêm axios để gọi API
import {
  InputComponent,
  ButtonComponent,
  SpaceComponent,
  TextComponent,
  RowComponent,
  SectionComponent,
  ContainerComponent,
} from '../../components';
import {Validate} from '../../utils/validate';
import {Image} from 'react-native';

const RegisterScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // Hàm kiểm tra email, số điện thoại, mật khẩu
  const handleValidation = () => {
    const emailValid = Validate.email(email);
    const phoneValid = Validate.phoneNumber(phoneNumber);
    const passwordValid = password.length >= 6 && password === confirmPassword;

    setIsEmailValid(emailValid);
    setIsPhoneValid(phoneValid);
    setIsPasswordValid(passwordValid);

    if (!emailValid) Alert.alert('Invalid Email');
    if (!phoneValid) Alert.alert('Invalid Phone Number');
    if (!passwordValid) Alert.alert('Passwords do not match or are too short');
  };

  // Hàm đăng ký và gọi API
  const handleRegister = async () => {
    // Call the validation function
    handleValidation();

    if (isEmailValid && isPhoneValid && isPasswordValid) {
      try {
        const user = {
          email,
          phoneNumber,
          password,
        };

        // Gọi API để đăng ký
        const response = await axios.post(
          'http://10.0.2.2:8088/api/users/register',
          user,
        );

        if (
          response.data === 'Registration successful. Check your email for OTP.'
        ) {
          Alert.alert(
            'Registration Successful',
            'Please check your email for OTP.',
          );
          // Chuyển đến màn hình xác thực OTP
          navigation.navigate('OtpVerifyRegisterScreen', {email});
        } else {
          Alert.alert('Registration Failed', response.data);
        }
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert('Error', 'An error occurred, please try again later.');
      }
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
        <TextComponent size={24} title text="Đăng ký" />
        <SpaceComponent height={20} />

        <InputComponent
          value={email}
          placeholder="Email"
          onChange={setEmail}
          keyboardType="email-address"
        />
        <InputComponent
          value={phoneNumber}
          placeholder="Số điện thoại"
          onChange={setPhoneNumber}
          keyboardType="phone-pad" // Sử dụng phone pad cho số điện thoại
        />

        <InputComponent
          value={password}
          placeholder="Mật khẩu"
          onChange={setPassword}
          isPassword
        />

        <InputComponent
          value={confirmPassword}
          placeholder="Xác thực mật khẩu"
          onChange={setConfirmPassword}
          isPassword
        />
      </SectionComponent>

      <SectionComponent>
        <ButtonComponent
          text="ĐĂNG KÝ"
          onPress={handleRegister}
          type="primary"
          disable={!email || !phoneNumber || !password || !confirmPassword} // Disable the button if OTP or newPassword is missing
        />
      </SectionComponent>

      <RowComponent justify="center" styles={{marginTop: 20}}>
        <TextComponent text="Bạn đã có tài khoản? " />
        <ButtonComponent
          type="link"
          text="Đăng nhập"
          onPress={() => navigation.navigate('LoginScreen')}
        />
      </RowComponent>
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

export default RegisterScreen;
