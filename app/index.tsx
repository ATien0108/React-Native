// app/index.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const IntroScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home"); // Điều hướng đến trang Home sau 10 giây
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông Tin Cá Nhân</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>Họ và tên: Trần Thị Á Tiên</Text>
        <Text style={styles.text}>MSSV: 21110318</Text>
        <Text style={styles.text}>
          Lớp: Lập trình di động nâng cao - Sáng thứ 3
        </Text>
      </View>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default IntroScreen;
