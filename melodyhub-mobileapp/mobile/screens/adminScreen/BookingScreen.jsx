import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://10.0.2.2:3000/api/admin/booking'; // ⚠️ sửa theo IP server của bạn

export default function BookingScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách booking
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error('Lỗi lấy booking:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách booking');
    } finally {
      setLoading(false);
    }
  };

  // Xóa booking
  const deleteBooking = (id_booking) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc muốn xóa booking này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${id_booking}`);
              setBookings((prev) => prev.filter((item) => item.id_booking !== id_booking));
            } catch (err) {
              console.error('Lỗi xóa booking:', err);
              Alert.alert('Lỗi', 'Không thể xóa booking');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderItem = ({ item }) => {
    const dateObj = new Date(item.booking_date);

    const formattedDate = dateObj.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const formattedTime = dateObj.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Booking #{item.id_booking}</Text>
          <Text>Event ID: {item.id_event}</Text>
          <Text>User ID: {item.id_user}</Text>
          <Text>Số lượng: {item.quantity}</Text>
          <Text>Thanh toán: {item.payment_method}</Text>
          <Text>Ngày đặt: {formattedDate} {formattedTime}</Text>
        </View>
        <TouchableOpacity onPress={() => deleteBooking(item.id_booking)}>
          <FontAwesome5 name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>
      <Text style={styles.header}>Danh sách Booking</Text>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id_booking.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  header: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  title: { fontWeight: 'bold', fontSize: 16 }
});
