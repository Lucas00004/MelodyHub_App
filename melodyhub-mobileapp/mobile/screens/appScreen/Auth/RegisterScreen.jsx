import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../../../services/api';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Trim dữ liệu
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    // Validation cơ bản
    if (!trimmedUsername || !trimmedPassword || !trimmedEmail || !trimmedPhone) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      console.log('Đang gửi request đăng ký...');
      const response = await api.post('/auth/register', {
        username: trimmedUsername,
        password: trimmedPassword,
        email: trimmedEmail,
        phone: trimmedPhone,
      });

      console.log('Response đăng ký:', response.data);
      Alert.alert('Thành công', 'Đăng ký thành công. Vui lòng đăng nhập.');
      navigation.replace('Login');
    } catch (err) {
      console.error('Lỗi đăng ký chi tiết:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });

      let errorMessage = 'Lỗi không xác định';

      if (err.code === 'ECONNREFUSED') {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Dữ liệu không hợp lệ';
      } else if (err.response?.status === 500) {
        errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      Alert.alert('Đăng ký thất bại', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký Tài Khoản</Text>

      <TextInput
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#7fbfff' }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Đăng ký</Text>}
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Đã có tài khoản? Đăng nhập
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#e6f3ff' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0066cc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#b3d9ff',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  button: {
    backgroundColor: '#3399ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  link: { marginTop: 15, color: '#0066cc', textAlign: 'center', fontSize: 14 },
});
