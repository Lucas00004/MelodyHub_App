import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
  Image,
} from "react-native";
import axios from "axios";

export default function VenueScreen() {
  const [venues, setVenues] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [capacity, setCapacity] = useState("");

  const API_URL = "http://10.0.2.2:3000/api/admin/venue";

  const fetchVenues = async () => {
    try {
      const res = await axios.get(API_URL);
      setVenues(res.data);
    } catch (err) {
      console.error("Lỗi fetch venues:", err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const openModal = (venue = null) => {
    if (venue) {
      setEditingVenue(venue);
      setName(venue.name);
      setImage(venue.image || "");
      setCapacity(String(venue.capacity || ""));
    } else {
      setEditingVenue(null);
      setName("");
      setImage("");
      setCapacity("");
    }
    setModalVisible(true);
  };

  const saveVenue = async () => {
    try {
      if (editingVenue) {
        await axios.put(`${API_URL}/${editingVenue.id_venue}`, {
          name,
          image,
          capacity,
        });
        Alert.alert("Thành công", "Cập nhật địa điểm thành công");
      } else {
        await axios.post(API_URL, { name, image, capacity });
        Alert.alert("Thành công", "Thêm địa điểm thành công");
      }
      setModalVisible(false);
      fetchVenues();
    } catch (err) {
      console.error("Lỗi lưu venue:", err);
      Alert.alert("Lỗi", "Không thể lưu địa điểm");
    }
  };

  const deleteVenue = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert("Thành công", "Xóa địa điểm thành công");
      fetchVenues();
    } catch (err) {
      console.error("Lỗi xóa venue:", err);
      Alert.alert("Lỗi", "Không thể xóa địa điểm");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#ccc" }]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.capacity}>Sức chứa: {item.capacity}</Text>
      </View>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.editBtn}>
        <Text style={{ color: "white" }}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteVenue(item.id_venue)}
        style={styles.deleteBtn}
      >
        <Text style={{ color: "white" }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id_venue.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={{ color: "white", fontWeight: "bold" }}>+ Thêm Địa điểm</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Tên địa điểm"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Link ảnh"
              value={image}
              onChangeText={setImage}
              style={styles.input}
            />
            <TextInput
              placeholder="Sức chứa"
              value={capacity}
              onChangeText={setCapacity}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button title="Lưu" onPress={saveVenue} />
            <Button
              title="Hủy"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  capacity: { fontSize: 13, color: "#555" },
  editBtn: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteBtn: {
    backgroundColor: "red",
    padding: 6,
    borderRadius: 5,
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "green",
    padding: 15,
    borderRadius: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
});
