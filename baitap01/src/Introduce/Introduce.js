import {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';

function App({navigation}) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigation.navigate('Home');
    }, 10000);
    return () => clearTimeout(timeoutId);
  }, []);

  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Home');
    }, countdown * 10000);

    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [countdown, navigation]);

  return (
    <View style={styles.bg}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/Tien.jpg')}
          style={styles.profilePic}
        />
      </View>
      <View>
        <Text style={styles.textCenter}>Trần Thị Á Tiên - 21110318</Text>
        <Text style={styles.textCenter}>
          Lập trình di động nâng cao - Sáng thứ 3
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#F2F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 40,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  textCenter: {
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default App;
