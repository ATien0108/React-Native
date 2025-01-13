// app/home.tsx
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  // Hàm quay lại IntroScreen
  const goBackToIntro = () => {
    router.replace("/"); // Điều hướng về trang IntroScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HomePage</Text>
      <Button title="Quay về trang Thông tin cá nhân" onPress={goBackToIntro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A1CEDC",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default HomeScreen;
