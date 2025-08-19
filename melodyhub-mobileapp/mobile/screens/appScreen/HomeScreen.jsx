import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import axios from 'axios';

const API_BASE = 'http://10.0.2.2:3000/api';

export default function HomeScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [artists, setArtists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [eventRes, venueRes, artistRes, categoryRes] = await Promise.all([
          axios.get(`${API_BASE}/events`),
          axios.get(`${API_BASE}/venue`),
          axios.get(`${API_BASE}/artist`),
          axios.get(`${API_BASE}/category`)
        ]);
        if (mounted) {
          setEvents(eventRes.data);
          setVenues(venueRes.data);
          setArtists(artistRes.data);
          setCategories(categoryRes.data);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có ngày';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Không hợp lệ';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // render cho từng section
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
        {item?.name ?? 'Không tên'}
      </Text>
      <Text style={styles.cardSub}>{formatDate(item?.start_time)}</Text>
    </TouchableOpacity>
  );

  const renderVenueCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.image || 'https://via.placeholder.com/150x100.png?text=No+Image' }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item?.name ?? 'Không tên'}
      </Text>
      <Text style={styles.cardSub}>Sức chứa: {item?.capacity ?? 'N/A'}</Text>
    </View>
  );

  const renderArtistCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.image || 'https://via.placeholder.com/150x100.png?text=No+Image' }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item?.name ?? 'Không tên'}
      </Text>
    </View>
  );

  const renderCategoryCard = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.image || 'https://via.placeholder.com/150x100.png?text=No+Image' }}
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item?.name ?? 'Không tên'}
      </Text>
    </View>
  );

  const sections = [
    { key: 'hot', title: 'Sự kiện nổi bật', icon: <MaterialIcons name="whatshot" size={24} color="orange" />, data: events, render: renderEventCard },
    { key: 'venue', title: 'Địa điểm', icon: <Entypo name="location-pin" size={24} color="red" />, data: venues, render: renderVenueCard },
    { key: 'singer', title: 'Ca sĩ', icon: <FontAwesome5 name="microphone-alt" size={20} color="purple" />, data: artists, render: renderArtistCard },
    { key: 'category', title: 'Thể loại', icon: <Entypo name="grid" size={24} color="green" />, data: categories, render: renderCategoryCard },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        {sections.map((section) => (
          <View key={section.key} style={styles.sectionWrapper}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {section.icon}
                <Text style={styles.sectionTitle}> {section.title}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (section.key === 'venue') {
                    navigation.navigate('OrderByVenueScreen');
                  } else if (section.key === 'category') {
                    navigation.navigate('OrderByCategoryScreen');
                  } else if (section.key === 'singer') {
                    navigation.navigate('OrderByArtistScreen');
                  } else {
                    navigation.navigate('EventListScreen', { filter: section.key });
                  }
                }}
              >
                <Text style={styles.seeMoreText}>Xem thêm &gt;</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={section.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => String(item.id_event || item.id_venue || item.id_artist || item.id_category || index)}
              renderItem={section.render}
            />
          </View>
        ))}

        {/* Liên hệ */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Liên hệ</Text>
          <Text>Email: ndinh6071@gmail.com</Text>
          <Text>Phở Bò: @lucasssssss (7 chữ 's' mới ra )</Text>
          <Text>React/React Native coi như là End Game.. GGEZ</Text>
          <Text>Lucá Code Đúng 1 Tuần Là Done App </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f0f4ff',
  },
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  sectionWrapper: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeMoreText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
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
  cardSub: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  contactSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    elevation: 4,
    marginTop: 24,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2a2a72',
  },
});
