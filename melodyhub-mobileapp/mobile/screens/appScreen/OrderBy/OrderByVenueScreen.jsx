import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const API_BASE = 'http://10.0.2.2:3000/api';

export default function OrderByVenueScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/events`);
        if (mounted) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('API error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Group event theo venue_name
  const sections = Object.values(
    events.reduce((acc, event) => {
      const venue = event.venue_name || 'Không rõ địa điểm';
      if (!acc[venue]) acc[venue] = { title: venue, data: [] };
      acc[venue].data.push(event);
      return acc;
    }, {})
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có';
    const date = new Date(dateString);
    if (isNaN(date)) return 'Không hợp lệ';
    const d = ('0' + date.getDate()).slice(-2);
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BookingEvent', { event: item })}
    >
      <Image
        source={{ uri: item?.image || 'https://via.placeholder.com/150x100.png?text=No+Image' }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item?.name}
      </Text>
      <Text style={styles.cardPrice}>
        {item?.ticket_price?.toLocaleString('vi-VN') ?? 'N/A'} VND
      </Text>
      <Text style={styles.cardDate}>
        {formatDate(item?.start_time)} - {formatDate(item?.end_time)}
      </Text>
    </TouchableOpacity>
  );


  return (
    <ScrollView style={styles.container}>
      {sections.map((section, index) => (
        <View key={index} style={styles.sectionWrapper}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <FlatList
            data={section.data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id_event)}
            renderItem={renderEventCard}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    padding: 16,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionWrapper: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2a2a72',
  },
  card: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 16,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    paddingHorizontal: 8,
    color: '#333',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginTop: 4,
    color: '#333', // đồng bộ với tên sự kiện
  },
  cardDate: {
    fontSize: 13,
    color: '#555',
    paddingHorizontal: 8,
    fontStyle: 'italic',
    marginTop: 2,
  },

});
