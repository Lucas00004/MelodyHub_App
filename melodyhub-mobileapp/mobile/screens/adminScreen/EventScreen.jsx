import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_URL = 'http://10.0.2.2:3000/api'; // ⚠️ sửa theo IP server của bạn


export default function EventScreen() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState('');
  const [idVenue, setIdVenue] = useState('');
  const [idCategory, setIdCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [ticketPrice, setTicketPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [seatLeft, setSeatLeft] = useState('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [isComposingName, setIsComposingName] = useState(false);
  const [isComposingDescription, setIsComposingDescription] = useState(false);


  useEffect(() => {
    fetchEvents();
    fetchVenues();
    fetchCategories();
  }, []);

  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      const rows = Array.isArray(res.data) ? res.data : [];
      setEvents(rows);
    } catch (err) {
      console.error('Lỗi load event:', err.message);
    }
  };

  const fetchVenues = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${API_URL}/admin/venue`, { headers });
      const rows = Array.isArray(res.data) ? res.data : [];
      setVenues(rows);
    } catch (err) {
      console.error('Lỗi load venue:', err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await axios.get(`${API_URL}/admin/category`, { headers });
      const rows = Array.isArray(res.data) ? res.data : [];
      setCategories(rows);
    } catch (err) {
      console.error('Lỗi load category:', err.message);
    }
  };

  const handleVenueChange = (venueId) => {
    setIdVenue(venueId);
    const selectedVenue = venues.find(v => v.id_venue === venueId);
    if (selectedVenue?.capacity) {
      setSeatLeft(selectedVenue.capacity.toString());
    }
  };

  const createEvent = async () => {
    try {
      const headers = await getAuthHeaders();
      const startDateTime = new Date(
        startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),
        startTime.getHours(), startTime.getMinutes()
      );
      const endDateTime = new Date(
        endDate.getFullYear(), endDate.getMonth(), endDate.getDate(),
        endTime.getHours(), endTime.getMinutes()
      );

      // Gửi JSON thay vì FormData
      const body = {
        name,
        id_venue: idVenue,
        id_category: idCategory,
        start_time: startDateTime.toISOString().slice(0, 19).replace('T', ' '),
        end_time: endDateTime.toISOString().slice(0, 19).replace('T', ' '),
        ticket_price: ticketPrice,
        description,
        seat_left: seatLeft,
        image // URL ảnh
      };

      await axios.post(`${API_URL}/admin/event`, body, { headers });

      fetchEvents();
      resetForm();
    } catch (err) {
      console.error('Lỗi tạo event:', err.message);
    }
  };


  const deleteEvent = async (id) => {
    try {
      const headers = await getAuthHeaders();
      await axios.delete(`${API_URL}/admin/event/${id}`, { headers });
      fetchEvents();
    } catch (err) {
      console.error('Lỗi xóa event:', err.message);
    }
  };

  const resetForm = () => {
    setName('');
    setIdVenue('');
    setIdCategory('');
    setStartDate(new Date());
    setStartTime(new Date());
    setEndDate(new Date());
    setEndTime(new Date());
    setTicketPrice('');
    setDescription('');
    setImage('');
    setSeatLeft('');
  };

  const renderForm = () => (
    <View>
      <Text style={styles.title}>Tạo Event Mới</Text>

      {/* Tên sự kiện */}
      <TextInput
        style={styles.input}
        placeholder="Tên sự kiện"
        value={name}
        autoCapitalize="none"
        autoCorrect={false}
        onChange={(e) => {
          if (!isComposingName) setName(e.nativeEvent.text);
        }}
        onCompositionStart={() => setIsComposingName(true)}
        onCompositionEnd={(e) => {
          setIsComposingName(false);
          setName(e.nativeEvent.text);
        }}
      />

      <Picker selectedValue={idVenue} onValueChange={handleVenueChange} style={styles.input}>
        <Picker.Item label="Chọn địa điểm" value="" />
        {venues.map((v) => (
          <Picker.Item key={v.id_venue} label={`${v.name} - ${v.capacity || 'N/A'} chỗ`} value={v.id_venue} />
        ))}
      </Picker>

      <Picker selectedValue={idCategory} onValueChange={setIdCategory} style={styles.input}>
        <Picker.Item label="Chọn thể loại" value="" />
        {categories.map((c) => (
          <Picker.Item key={c.id_category} label={c.name} value={c.id_category} />
        ))}
      </Picker>

      <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateBtn}>
        <Text>Chọn ngày bắt đầu: {startDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowStartDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.dateBtn}>
        <Text>Chọn giờ bắt đầu: {startTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(e, date) => {
            setShowStartTimePicker(false);
            if (date) setStartTime(date);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateBtn}>
        <Text>Chọn ngày kết thúc: {endDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.dateBtn}>
        <Text>Chọn giờ kết thúc: {endTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(e, date) => {
            setShowEndTimePicker(false);
            if (date) setEndTime(date);
          }}
        />
      )}

      {/* Giá vé */}
      <TextInput
        style={styles.input}
        placeholder="Giá vé"
        value={ticketPrice}
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        onChange={(e) => setTicketPrice(e.nativeEvent.text)}
      />

      {/* Mô tả */}
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Mô tả"
        value={description}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
        onChange={(e) => {
          if (!isComposingDescription) setDescription(e.nativeEvent.text);
        }}
        onCompositionStart={() => setIsComposingDescription(true)}
        onCompositionEnd={(e) => {
          setIsComposingDescription(false);
          setDescription(e.nativeEvent.text);
        }}
      />

      {/* Link ảnh */}
      <TextInput
        style={styles.input}
        placeholder="Nhập link ảnh"
        value={image}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={setImage}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.previewImage} />
      ) : null}

      <TouchableOpacity style={styles.createBtn} onPress={createEvent}>
        <Text style={{ color: '#fff' }}>Tạo sự kiện</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ListHeaderComponent={
          <View>
            {renderForm()}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Danh sách sự kiện</Text>
          </View>
        }
        data={events}
        keyExtractor={(item) => item.id_event.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={item.image ? { uri: item.image } : require('../../assets/no-image.png')}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{item.name}</Text>
              <Text>Giá: {item.ticket_price}</Text>
              <Text>Ghế còn: {item.seat_left}</Text>
              <TouchableOpacity style={styles.btnDelete} onPress={() => deleteEvent(item.id_event)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: { padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 5, borderRadius: 5 },
  btnDelete: { backgroundColor: 'red', padding: 5, borderRadius: 5, marginTop: 5, alignItems: 'center' },
  btnText: { color: '#fff' },
  card: { flexDirection: 'row', padding: 10, borderWidth: 1, borderColor: '#ddd', marginVertical: 5, borderRadius: 5, alignItems: 'center' },
  eventImage: { width: 80, height: 80, borderRadius: 5, backgroundColor: '#eee', marginRight: 10 },
  eventInfo: { flex: 1 },
  eventName: { fontSize: 16, fontWeight: 'bold' },
  dateBtn: { padding: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginVertical: 5 },
  imageBtn: { padding: 10, backgroundColor: '#ddd', borderRadius: 5, alignItems: 'center', marginVertical: 5 },
  previewImage: { width: 100, height: 100, borderRadius: 5, marginVertical: 5 },
  createBtn: { padding: 10, backgroundColor: 'green', borderRadius: 5, alignItems: 'center', marginVertical: 10 }
});