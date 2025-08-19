import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
} from "react-native";
import axios from "axios";

export default function ArtistScreen() {
  const [artists, setArtists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Nam"); // default
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");

  const API_URL = "http://10.0.2.2:3000/api/admin/artist";

  const fetchArtists = async () => {
    try {
      const res = await axios.get(API_URL);
      setArtists(res.data);
    } catch (err) {
      console.error("Lỗi fetch artists:", err);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const openModal = (artist = null) => {
    if (artist) {
      setEditingArtist(artist);
      setName(artist.name);
      setGender(artist.gender);
      setBio(artist.bio);
      setImage(artist.image || "");
    } else {
      setEditingArtist(null);
      setName("");
      setGender("Nam");
      setBio("");
      setImage("");
    }
    setModalVisible(true);
  };

  const saveArtist = async () => {
    try {
      if (editingArtist) {
        await axios.put(`${API_URL}/${editingArtist.id_artist}`, {
          name,
          gender,
          bio,
          image,
        });
        Alert.alert("Thành công", "Cập nhật artist thành công");
      } else {
        await axios.post(API_URL, { name, gender, bio, image });
        Alert.alert("Thành công", "Thêm artist thành công");
      }
      setModalVisible(false);
      fetchArtists();
    } catch (err) {
      console.error("Lỗi lưu artist:", err);
      Alert.alert("Lỗi", "Không thể lưu artist");
    }
  };

  const deleteArtist = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert("Thành công", "Xóa artist thành công");
      fetchArtists();
    } catch (err) {
      console.error("Lỗi xóa artist:", err);
      Alert.alert("Lỗi", "Không thể xóa artist");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.gender}>{item.gender}</Text>
        {item.bio ? (
          <Text style={styles.bio} numberOfLines={2}>
            {item.bio}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.editBtn}>
        <Text style={{ color: "white" }}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteArtist(item.id_artist)}
        style={styles.deleteBtn}
      >
        <Text style={{ color: "white" }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={artists}
        keyExtractor={(item) => item.id_artist.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={{ color: "white", fontWeight: "bold" }}>+ Thêm Artist</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Tên artist"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Tiểu sử"
              value={bio}
              onChangeText={setBio}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <TextInput
              placeholder="Link ảnh (https://...)"
              value={image}
              onChangeText={setImage}
              style={styles.input}
            />

            <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
              Giới tính:
            </Text>
            <View style={styles.genderRow}>
              {["Nam", "Nữ", "Khác"].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderBtn,
                    gender === g && styles.genderBtnActive,
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={{
                      color: gender === g ? "white" : "black",
                      fontWeight: "bold",
                    }}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Lưu" onPress={saveArtist} />
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
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  gender: { fontSize: 14, color: "#666" },
  bio: { fontSize: 13, color: "#444", marginTop: 2 },
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
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  genderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    marginHorizontal: 5,
  },
  genderBtnActive: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
});
