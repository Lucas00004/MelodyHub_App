import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const API_BASE = 'http://10.0.2.2:3000/api';


export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`${API_BASE}/events`)
      .then((res) => {
        if (mounted) setEvents(res.data);
      })
      .catch((err) => {
        console.error('API error:', err);
        if (mounted) setEvents([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return 'Miễn phí';
    const n = Number(price);
    if (Number.isNaN(n)) return String(price);
    return n.toLocaleString('vi-VN') + ' VNĐ';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingEvent', { event: item })}
    >
      <Image
        source={{
          uri:
            item?.image ||
            'https://via.placeholder.com/200x120.png?text=No+Image',
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{item?.name ?? 'Không tên'}</Text>
        <Text style={styles.info}>Giá vé: {formatPrice(item?.ticket_price)}</Text>
        <Text style={styles.info}>
          Thể loại: {item?.category_name ?? 'Không rõ'}
        </Text>
        <Text style={styles.date}>
          {`Ngày: ${formatDate(item?.start_time)} - ${formatDate(item?.end_time)}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id_event ? String(item.id_event) : String(index)
        }
        contentContainerStyle={[styles.container, { paddingBottom: 110 }]}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Không có sự kiện nào để hiển thị.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  container: {
    padding: 12,
  },
  card: {
    marginBottom: 18,
    borderRadius: 14,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    height: 200,
    width: '100%',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a72',
    marginBottom: 6,
  },
  info: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
