import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

export default function UserScreen() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "client",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null); // null = tạo mới, khác null = đang sửa

  const API_BASE = "http://10.0.2.2:3000/api";

  // Lấy danh sách user
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/user`);
      setUsers(res.data);
    } catch (error) {
        console.error("Chi tiết lỗi API:", error.response?.data || error.message);
        Alert.alert("Lỗi", "Không thể tải danh sách user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset form
  const resetForm = () => {
    setForm({ username: "", email: "", password: "", role: "client", phone: "" });
    setEditingId(null);
  };

  // Tạo user mới
    const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
        return Alert.alert("Lỗi", "Vui lòng nhập đủ username, email, password");
    }
    try {
        await axios.post(`${API_BASE}/admin/user`, form); // ✅ sửa ở đây
        Alert.alert("Thành công", "Tạo user thành công");
        fetchUsers();
        resetForm();
    } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Không thể tạo user");
    }
    };


  // Cập nhật user
  const handleUpdate = async () => {
    try {
      await axios.post(`${API_BASE}/admin/user/${editingId}`, form);
      Alert.alert("Thành công", "Cập nhật user thành công");
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật user");
    }
  };

  // Xóa user
  const handleDelete = async (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa user này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await axios.delete(`${API_BASE}/admin/user/${id}`);
            Alert.alert("Thành công", "Xóa user thành công");
            fetchUsers();
          } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể xóa user");
          }
        },
      },
    ]);
  };

  // Khi bấm Edit
  const handleEdit = (user) => {
    setForm({
      username: user.username,
      email: user.email,
      password: "", // không load password từ DB
      role: user.role,
      phone: user.phone || "",
    });
    setEditingId(user.id_user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? "Chỉnh sửa User" : "Tạo User mới"}
      </Text>

      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={form.username}
        onChangeText={(text) => setForm({ ...form, username: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={form.password}
        secureTextEntry
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
                >
                <Picker.Item label="Client" value="client" />
                <Picker.Item label="Admin" value="admin" />
            </Picker>
        </View>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
      />

      {/* Nút Save */}
      <TouchableOpacity
        style={styles.button}
        onPress={editingId ? handleUpdate : handleCreate}
      >
        <Text style={styles.buttonText}>
          {editingId ? "Cập nhật" : "Tạo mới"}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "gray" }]}
          onPress={resetForm}
        >
          <Text style={styles.buttonText}>Hủy chỉnh sửa</Text>
        </TouchableOpacity>
      )}

      {/* Danh sách user */}
      <Text style={[styles.title, { marginTop: 20 }]}>Danh sách User</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id_user.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text>{item.username} ({item.role})</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ffa500" }]}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "red" }]}
                onPress={() => handleDelete(item.id_user)}
              >
                <Text style={styles.buttonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  actions: { flexDirection: "row" },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },

});
