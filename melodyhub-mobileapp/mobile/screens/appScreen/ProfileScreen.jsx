import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_BASE = 'http://10.0.2.2:3000/api';


export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !password || !confirmPassword) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
    }

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_BASE}/profile`,
        { oldPassword, newPassword: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Thành công', 'Mật khẩu đã được thay đổi');
      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err.response?.data || err.message);
      const message =
        err.response?.data?.message || 'Không thể đổi mật khẩu';
      Alert.alert('Lỗi', message);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
        <Text>Không thể tải thông tin người dùng</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#f4f6f8"
        translucent={false}
      />

      {/* Thông tin người dùng */}
      <View style={styles.card}>
        <Text style={styles.label}>Tên đăng nhập</Text>
        <Text style={styles.value}>{profile.username}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{profile.email}</Text>

        <Text style={styles.label}>Số điện thoại</Text>
        <Text style={styles.value}>
          {profile.phone || 'Chưa cập nhật'}
        </Text>
      </View>

      {/* Đổi mật khẩu */}
      <View style={styles.card}>
        <Text style={styles.label}>Mật khẩu cũ</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
          placeholder="Nhập mật khẩu cũ"
        />

        <Text style={styles.label}>Mật khẩu mới</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu mới"
        />

        <Text style={styles.label}>Xác nhận mật khẩu</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Nhập lại mật khẩu"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
        </TouchableOpacity>
      </View>

      {/* Đăng xuất */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: { fontSize: 14, color: '#888', marginTop: 8 },
  value: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 4 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
