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


export default function OrderByArtistScreen({ navigation }) {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    axios
      .get(`${API_BASE}/artist`)
      .then((res) => {
        console.log('RAW DATA:', res.data);
        if (mounted) setArtists(res.data);
      })
      .catch((err) => {
        console.error('API error:', err);
        if (mounted) setArtists([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ArtistDetail', { artist: item })}
      >
        <Image
          source={{
            uri:
              item?.image ||
              'https://via.placeholder.com/200x200.png?text=No+Image',
          }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{item?.name ?? 'Không tên'}</Text>
          <Text style={styles.info}>
            Giới tính: {item?.gender ?? 'Không rõ'}
          </Text>
          <Text style={styles.subtitle}>
            {item?.bio ? item.bio : 'Chưa có mô tả'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.wrapper,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={artists}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item?.id_artist ? String(item.id_artist) : String(index)
        }
        contentContainerStyle={[styles.container, { paddingBottom: 110 }]}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Không có nghệ sĩ nào để hiển thị.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    height: 200,
    width: '100%',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});
