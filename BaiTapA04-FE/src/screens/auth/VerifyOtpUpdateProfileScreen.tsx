import {Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {Sms} from 'iconsax-react-native';
import {Validate} from '../../utils/validate';
import axios from 'axios';

const VerifyOtpUpdateProfileScreen = ({navigation, route}: any) => {
  const {email} = route.params; // Lấy email từ route params
  const [otp, setOtp] = useState('');
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    const otpIsValid = otp.length === 6;
    if (!otp || !otpIsValid) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [otp]);

  const handleVerifyOtp = async () => {
    try {
      // Gọi API xác thực OTP, sử dụng RequestParam qua URL
      const response = await axios.post(
        `http://10.0.2.2:8088/api/users/verify-otp?email=${email}&otp=${otp}`,
      );

      if (response.data) {
        console.log('OTP Verified');
        navigation.goBack();
      } else {
        console.log('Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
    }
  };

  return (
    <ContainerComponent isScroll>
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
        <TextComponent size={24} title text="Xác thực OTP" />
        <SpaceComponent height={21} />
        <InputComponent
          value={otp}
          placeholder="Nhập OTP"
          onChange={val => setOtp(val)}
          allowClear
          affix={<Sms size={22} color={appColors.gray} />}
        />
      </SectionComponent>
      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          disable={isDisable}
          text="GỬI"
          onPress={handleVerifyOtp}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default VerifyOtpUpdateProfileScreen;
