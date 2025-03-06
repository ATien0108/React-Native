import React, {useState, useEffect} from 'react';
import {Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '../../constants/appColors';
import {Lock, Sms, User, Camera} from 'iconsax-react-native';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import {AxiosError} from 'axios';

const ProfileEditScreen = ({navigation, route}: any) => {
  const {email} = route.params;
  const [user, setUser] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    address: {
      street: '',
      communes: '',
      district: '',
      city: '',
    },
    isVerified: false,
  });
  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [oldPhoneNumber, setOldPhoneNumber] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://10.0.2.2:8088/api/users/profile?email=${email}`,
        );
        const fetchedUser = response.data;

        const username = fetchedUser.username || '';

        const address = fetchedUser.address || {
          street: '',
          communes: '',
          district: '',
          city: '',
        };

        setUser({
          username: username,
          email: fetchedUser.email,
          phoneNumber: fetchedUser.phoneNumber,
          avatar: fetchedUser.avatar || 'default-avatar-url',
          address: address, // Dữ liệu address mặc định nếu không có
          isVerified: fetchedUser.verified,
        });

        setOldPhoneNumber(fetchedUser.phoneNumber);
        setIsDisable(false);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // Kiểm tra nếu là lỗi của axios
          console.error(
            'Axios error details: ',
            error.response ? error.response.data : error.message,
          );
        } else {
          // Xử lý các lỗi không phải của axios (nếu có)
          console.error('Unexpected error: ', error);
        }
        setError('Failed to update profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [email]);

  const handleInputChange = (field: string, value: any) => {
    setUser({
      ...user,
      [field]: value,
    });
  };

  const handleAddressChange = (field: string, value: any) => {
    setUser({
      ...user,
      address: {
        ...user.address,
        [field]: value,
      },
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare the address as a JSON string
      const addressJson = JSON.stringify(user.address);

      // Create FormData to send the data
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('username', user.username);
      formData.append('phoneNumber', user.phoneNumber);
      formData.append('address', addressJson);

      // Only append avatar if it's selected and not the default avatar
      if (user.avatar && user.avatar !== 'default-avatar-url') {
        const avatar = {
          uri: user.avatar,
          name: 'avatar.jpg',
          type: 'image/jpeg',
        };
        formData.append('avatar', avatar);
      }

      console.log('FormData: ', formData); // Log FormData to debug

      const response = await axios.post(
        'http://10.0.2.2:8088/api/users/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        },
      );
      console.log('API Response: ', response.data);

      if (response.data) {
        console.log('User profile updated successfully');
        if (user.phoneNumber !== oldPhoneNumber) {
          navigation.navigate('VerifyOtpUpdateProfileScreen', {
            email: user.email,
          });
        } else {
          setLoading(true);
          const response = await axios.get(
            `http://10.0.2.2:8088/api/users/profile?email=${user.email}`,
          );
          const fetchedUser = response.data;

          setUser({
            username: fetchedUser.username,
            email: fetchedUser.email,
            phoneNumber: fetchedUser.phoneNumber,
            avatar: fetchedUser.avatar || 'default-avatar-url',
            address: {
              street: fetchedUser.address.street || '',
              communes: fetchedUser.address.communes || '',
              district: fetchedUser.address.district || '',
              city: fetchedUser.address.city || '',
            },
            isVerified: fetchedUser.verified,
          });

          setOldPhoneNumber(fetchedUser.phoneNumber);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update profile. Please try again later.');
    }
  };

  const handleAvatarChange = () => {
    launchImageLibrary({mediaType: 'photo'}, (response: any) => {
      console.log('Image picker response:', response); // Log toàn bộ response

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        console.log('Selected Image URI: ', selectedImage); // Log URL của ảnh đã chọn

        if (selectedImage) {
          setUser({
            ...user,
            avatar: selectedImage,
          });
        }
      } else {
        console.log('No assets selected');
      }
    });
  };

  if (loading) {
    return (
      <ContainerComponent isImageBackground isScroll>
        <ActivityIndicator size="large" color={appColors.primary} />
        <TextComponent text="Loading user data..." />
      </ContainerComponent>
    );
  }

  if (error) {
    return (
      <ContainerComponent isImageBackground isScroll>
        <TextComponent text={error} color={appColors.danger} />
      </ContainerComponent>
    );
  }

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
          }}
        />
      </SectionComponent>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TextComponent size={24} title text="Trang cá nhân" />
      </SectionComponent>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={handleAvatarChange}>
          <Image
            source={{uri: user.avatar}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 20,
            }}
          />
          <Camera
            size={30}
            color={appColors.primary}
            style={{position: 'absolute', bottom: 5, right: 5}}
          />
        </TouchableOpacity>
      </SectionComponent>

      <SectionComponent>
        <TextComponent size={16} title text="Username" />
        <InputComponent
          value={user.username}
          placeholder="Username"
          onChange={val => handleInputChange('username', val)}
          allowClear
          affix={<User size={22} color={appColors.gray} />}
        />
        <TextComponent size={16} title text="Email" />

        <InputComponent
          value={user.email}
          placeholder="Email"
          onChange={val => handleInputChange('email', val)}
          allowClear
          affix={<User size={22} color={appColors.gray} />}
        />
        <TextComponent size={16} title text="Số điện thoại" />
        <InputComponent
          value={user.phoneNumber}
          placeholder="Số điện thoại"
          onChange={val => handleInputChange('phoneNumber', val)}
          allowClear
        />
        <TextComponent size={16} title text="Đường" />
        <InputComponent
          value={user.address.street}
          placeholder="Đường"
          onChange={val => handleAddressChange('street', val)}
          allowClear
        />
        <TextComponent size={16} title text="Phường/Xã" />
        <InputComponent
          value={user.address.communes}
          placeholder="Phường/Xã"
          onChange={val => handleAddressChange('communes', val)}
          allowClear
        />
        <TextComponent size={16} title text="Quận/Huyện" />
        <InputComponent
          value={user.address.district}
          placeholder="Quận/Huyện"
          onChange={val => handleAddressChange('district', val)}
          allowClear
        />
        <TextComponent size={16} title text="Tỉnh/Thành Phố" />
        <InputComponent
          value={user.address.city}
          placeholder="Tỉnh/Thành Phố"
          onChange={val => handleAddressChange('city', val)}
          allowClear
        />
      </SectionComponent>

      <SpaceComponent height={16} />
      <SectionComponent>
        <ButtonComponent
          disable={isDisable}
          text="LƯU"
          onPress={handleSaveChanges}
          type="primary"
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

export default ProfileEditScreen;
