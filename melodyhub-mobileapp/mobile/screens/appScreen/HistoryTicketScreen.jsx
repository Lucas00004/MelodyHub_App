import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // ✅ Thêm vào

const API_BASE = 'http://10.0.2.2:3000/api';


export default function HistoryTicket({ navigation }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused(); // ✅ Lấy trạng thái focus

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setTickets([]);
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${API_BASE}/booking`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const mapped = res.data.map(bk => {
        const amount = Number(bk.amount) || 0;
        const quantity = Number(bk.quantity) || 0;
        return {
          id_ticket: bk.id_booking,
          event_name: bk.event_name || 'Không tên sự kiện',
          quantity,
          amount,
          total_price: quantity * amount,
          booking_date: bk.booking_date,
          image: bk.image
            ? (bk.image.startsWith('http')
              ? bk.image
              : `http://192.168.200.35:3000/uploads/${bk.image}`)
            : null
        };
      });

      setTickets(mapped);
    } catch (err) {
      console.error('API error:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) { // ✅ Mỗi khi màn hình được focus lại
      fetchTickets();
    }
  }, [isFocused]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có ngày';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  };

  const formatPrice = (num) => {
    if (!num || isNaN(num)) return '0 VNĐ';
    return num.toLocaleString('vi-VN') + ' VNĐ';
  };

  const renderTicketCard = ({ item }) => (
    <TouchableOpacity style={styles.ticketCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150x100.png?text=No+Image' }}
        style={styles.ticketImage}
      />
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketName} numberOfLines={1}>
          {item.event_name}
        </Text>
        <Text style={styles.ticketDetail}>Số lượng vé: {item.quantity}</Text>
        <Text style={styles.ticketDetail}>Giá vé: {formatPrice(item.amount)}</Text>
        <Text style={styles.ticketDetail}>Đã thanh toán: {formatPrice(item.total_price)}</Text>
        <Text style={styles.ticketDate}>Thời gian: {formatDate(item.booking_date)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrapper}>
        <ActivityIndicator size="large" color="#1976d2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text style={styles.headerTitle}>Lịch sử giao dịch</Text>
      {tickets.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <FontAwesome5 name="ticket-alt" size={50} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa có giao dịch nào</Text>
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => String(item.id_ticket)}
          renderItem={renderTicketCard}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 16,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  ticketImage: {
    width: 110,
    height: '100%',
  },
  ticketInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-around',
  },
  ticketName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ticketDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 4
  },
  ticketDetail: {
    fontSize: 13,
    color: '#555',
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
  },
});
