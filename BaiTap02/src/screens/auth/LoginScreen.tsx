import {Image, Switch} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios'; // Thêm axios
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {Lock, Sms} from 'iconsax-react-native';
import {Validate} from '../../utils/validate';

const LoginScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(true);
  const [isDisable, setIsDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(''); // Để hiển thị lỗi

  useEffect(() => {
    const emailValidation = Validate.email(email);
    if (!email || !password || !emailValidation) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [email, password]);

  // Handle login
  const handleLogin = async () => {
    if (isDisable) {
      setErrorMessage('Please fill in valid email and password.');
      return;
    }

    try {
      console.log('Logging in...');
      const response = await axios.post(
        `http://10.0.2.2:8088/api/users/login?email=${email}&password=${password}`, // Gửi query string giống như Postman
      );

      // Log thông tin phản hồi từ server
      console.log('Login response:', response.data);

      // Kiểm tra xem API có trả về token hay không
      if (response.data.includes('Token:')) {
        // Kiểm tra nếu phản hồi chứa token
        // Điều hướng sau khi login thành công
        navigation.navigate('HomeScreen');
      } else {
        // Nếu không có token, hiển thị lỗi
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred, please try again later.');
    }
  };

  return (
    <ContainerComponent isImageBackground isScroll>
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
        <TextComponent size={24} title text="Sign in" />
        <SpaceComponent height={21} />
        <InputComponent
          value={email}
          placeholder="Email"
          onChange={val => setEmail(val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />
        <InputComponent
          value={password}
          placeholder="Password"
          onChange={val => setPassword(val)}
          isPassword
          allowClear
          affix={<Lock size={22} color={appColors.gray} />}
        />
        <RowComponent justify="space-between">
          <RowComponent onPress={() => setIsRemember(!isRemember)}>
            <Switch
              trackColor={{true: appColors.primary}}
              thumbColor={appColors.white}
              value={isRemember}
              onChange={() => setIsRemember(!isRemember)}
            />
            <SpaceComponent width={4} />
            <TextComponent text="Remember me" />
          </RowComponent>
          <ButtonComponent
            text="Forgot Password?"
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            type="text"
          />
        </RowComponent>
      </SectionComponent>

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage && (
        <SectionComponent>
          <TextComponent text={errorMessage} color={appColors.danger} />
        </SectionComponent>
      )}

      <SpaceComponent height={16} />

      <SectionComponent>
        <ButtonComponent
          onPress={handleLogin} // Gọi hàm đăng nhập
          text="SIGN IN"
          type="primary"
        />
      </SectionComponent>

      <SectionComponent>
        <RowComponent justify="center">
          <TextComponent text="Don't have an account? " />
          <ButtonComponent
            type="link"
            text="Sign up"
            onPress={() => navigation.navigate('RegisterScreen')}
          />
        </RowComponent>
      </SectionComponent>
    </ContainerComponent>
  );
};

export default LoginScreen;
