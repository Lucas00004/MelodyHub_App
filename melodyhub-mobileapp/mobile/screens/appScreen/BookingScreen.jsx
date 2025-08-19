// Screen này là khi thanh toán vé
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://10.0.2.2:3000/api';


export default function EventDetailScreen({ route }) {
  const { event } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [seatNumber, setSeatNumber] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Momo");
  const [eventData, setEventData] = useState(event);

  const imageUrl = eventData?.image?.startsWith('http')
    ? eventData.image
    : `http://192.168.200.35:3000/uploads/${eventData?.image}`;


  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '0 VNĐ';
    return parseInt(price).toLocaleString('vi-VN') + ' VNĐ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không rõ';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không rõ';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Không rõ';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không rõ';
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  };


  const confirmBooking = () => {
    Alert.alert(
      "Xác nhận đặt vé",
      `Bạn muốn mua ${quantity} vé cho sự kiện "${eventData.name}"?\nPhương thức: ${paymentMethod}`,
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xác nhận", onPress: () => handleBooking() }
      ]
    );
  };

  const fetchEventDetail = async () => {
    try {
      const res = await axios.get(`${API_BASE}/events/${eventData.id_event}`);
      setEventData(res.data);
    } catch (err) {
      console.error("Lỗi tải event:", err);
    }
  };

  const handleBooking = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await axios.post(
        `${API_BASE}/booking`,
        {
          id_event: eventData.id_event,
          quantity,
          seat_number: seatNumber,
          payment_method: paymentMethod
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        Alert.alert('Thành công', 'Bạn đã đặt vé thành công!');
        await fetchEventDetail(); // Cập nhật lại số ghế còn lại
      } else {
        Alert.alert('Thất bại', 'Không thể đặt vé.');
      }
    } catch (error) {
      console.error('Lỗi đặt vé:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri:
            imageUrl && imageUrl !== 'NULL'
              ? imageUrl
              : 'https://via.placeholder.com/400x200.png?text=No+Image',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{eventData?.name || 'Không rõ tên sự kiện'}</Text>
        <Text style={styles.info}>
          Ngày diễn ra: {formatDate(eventData?.start_time)} - {formatDate(eventData?.end_time)}
        </Text>
        <Text style={styles.info}>
          Địa điểm: {eventData?.venue_name || 'Không rõ'}
        </Text>
        <Text style={styles.info}>
          Thời gian diễn ra: {formatTime(eventData?.start_time)} - {formatTime(eventData?.end_time)}
        </Text>

        <Text style={styles.info}>
          Số ghế còn lại: {isNaN(eventData?.seat_left) ? 0 : Number(eventData.seat_left).toLocaleString('vi-VN')}
        </Text>
        <Text style={styles.price}>Giá vé: {formatPrice(eventData?.ticket_price)}</Text>
        <Text style={styles.description}>Mô tả: {eventData?.description || ''}</Text>

        <View style={{ marginVertical: 10 }}>
          <Text>Số lượng vé:</Text>
          <TextInput
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(Number(text))}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={{ marginTop: 10 }}>Phương thức thanh toán:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
            >
              <Picker.Item label="Thanh toán bằng Momo" value="Momo" />
              <Picker.Item label="Thanh toán bằng Ngân hàng" value="Bank" />
            </Picker>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Đặt vé" onPress={confirmBooking} color="#1e90ff" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  description: { fontSize: 16, marginTop: 12, lineHeight: 22 },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e91e63',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5
  }
});
