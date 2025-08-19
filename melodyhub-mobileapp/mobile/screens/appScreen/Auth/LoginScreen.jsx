import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      console.log('📡 Đang gửi request đăng nhập...');
      const res = await api.post('/auth/login', { username, password });

      console.log('✅ Response đăng nhập:', res.data);

      // Lưu token và user
      await AsyncStorage.setItem('token', res.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));

      // Kiểm tra lại token
      const checkToken = await AsyncStorage.getItem('token');
      console.log('🔑 Token đã lưu:', checkToken);

      const role = res.data.user.role;
      if (role === 'admin') {
        navigation.replace('AdminHome');
      } else {
        navigation.replace('AppHome');
      }

    } catch (err) {
      console.error('❌ Lỗi đăng nhập chi tiết:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });

      let errorMessage = 'Lỗi không xác định';

      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Sai thông tin đăng nhập';
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      Alert.alert('Đăng nhập thất bại', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Melody Hub</Text>
      <Text style={styles.icon}>🎵🎶🎵</Text>

      <Text style={styles.title}>Đăng nhập</Text>

      <TextInput
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#666"
      />
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Chưa có tài khoản? <Text style={{ fontWeight: 'bold' }}>Đăng ký</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20, 
    backgroundColor: '#e6f4ff'
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0077cc',
    fontFamily: 'sans-serif-medium',
    textAlign: 'center'
  },
  icon: {
    fontSize: 28,
    marginBottom: 30,
    textAlign: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#004d80'
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#80cfff',
    marginBottom: 15,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#fff',
    color: '#000'
  },
  button: {
    backgroundColor: '#0077cc',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 5,
    width: '90%'
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  link: { 
    marginTop: 15, 
    color: '#004d80', 
    textAlign: 'center' 
  },
});
