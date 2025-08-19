import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashBoard({ navigation }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log('📌 Token hiện tại trong DashBoard:', token);
    };
    checkToken();
  }, []);

  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Hệ Thống Quản Lý</Text>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('EventScreen')}>
            <Ionicons name="calendar-outline" size={32} color="#007bff" />
            <Text>Sự kiện</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ArtistScreen')}>
            <Ionicons name="person-outline" size={32} color="#007bff" />
            <Text>Nghệ sĩ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookingScreen')}>
            <Ionicons name="ticket-outline" size={32} color="#007bff" />
            <Text>Đặt vé</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CategoryScreen')}>
            <Ionicons name="pricetags-outline" size={32} color="#007bff" />
            <Text>Thể loại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ReviewScreen')}>
            <Ionicons name="chatbox-ellipses-outline" size={32} color="#007bff" />
            <Text>Đánh giá</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserScreen')}>
            <Ionicons name="people-outline" size={32} color="#007bff" />
            <Text>Người dùng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, styles.fullWidth]} onPress={() => navigation.navigate('VenueScreen')}>
            <Ionicons name="location-outline" size={32} color="#007bff" />
            <Text>Địa điểm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E6F2FF' },
  scrollContent: { padding: 16, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: {
    width: '40%',
    backgroundColor: '#B3D9FF',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  fullWidth: { width: '85%' }
});
