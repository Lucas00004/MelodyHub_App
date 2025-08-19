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

export default function CategoryScreen() {
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const API_URL = "http://10.0.2.2:3000/api/admin/category";

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setImage(category.image || "");
    } else {
      setEditingCategory(null);
      setName("");
      setImage("");
    }
    setModalVisible(true);
  };

  const saveCategory = async () => {
    try {
      if (editingCategory) {
        await axios.put(`${API_URL}/${editingCategory.id_category}`, { name, image });
        Alert.alert("Thành công", "Cập nhật thể loại thành công");
      } else {
        await axios.post(API_URL, { name, image });
        Alert.alert("Thành công", "Thêm thể loại thành công");
      }
      setModalVisible(false);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi lưu category:", err);
      Alert.alert("Lỗi", "Không thể lưu thể loại");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      Alert.alert("Thành công", "Xóa thể loại thành công");
      fetchCategories();
    } catch (err) {
      console.error("Lỗi xóa category:", err);
      Alert.alert("Lỗi", "Không thể xóa thể loại");
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
      </View>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.editBtn}>
        <Text style={{ color: "white" }}>Sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => deleteCategory(item.id_category)}
        style={styles.deleteBtn}
      >
        <Text style={{ color: "white" }}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id_category.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.addBtn} onPress={() => openModal()}>
        <Text style={{ color: "white", fontWeight: "bold" }}>+ Thêm Thể loại</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Tên thể loại"
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
            <Button title="Lưu" onPress={saveCategory} />
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
