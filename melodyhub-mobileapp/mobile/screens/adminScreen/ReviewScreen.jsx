import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";

const API_URL = "http://10.0.2.2:3000/api/admin";

const ReviewScreen = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/review`);
      setReviews(res.data);
    } catch (err) {
      console.error("Lỗi fetch review:", err);
    } finally {
      setLoading(false);
    }
  };

    const handleDelete = async (id_review) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa review này?", [
            { text: "Hủy", style: "cancel" },
            {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
                try {
                await axios.delete(`${API_URL}/review`, { data: { id: id_review } });
                fetchReviews();
                Alert.alert("Thành công", "Xóa review thành công!");
                } catch (err) {
                console.error("Lỗi xóa review:", err);
                Alert.alert("Lỗi", "Không thể xóa review.");
                }
            },
            },
        ]);
    };


  const renderStars = (rating) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <FontAwesome
            key={i}
            name={i < rating ? "star" : "star-o"}
            size={16}
            color="gold"
          />
        ))}
      </View>
    );
  };

  const filteredReviews = reviews.filter((r) =>
    r.event_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Đánh giá</Text>

      <TextInput
        style={styles.search}
        placeholder="Tìm theo tên sự kiện..."
        value={search}
        onChangeText={setSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
            data={filteredReviews}
            keyExtractor={(item) => item.id_review.toString()}
            renderItem={({ item }) => (
                <View style={styles.card}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.eventName}>{item.event_name}</Text>
                    <Text style={styles.userName}>Người dùng: {item.user_name}</Text>
                    {renderStars(item.rating)}
                    <Text style={styles.comment}>{item.comment}</Text>
                    <Text style={styles.date}>
                    {new Date(item.review_date).toLocaleString()}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item.id_review)}
                >
                    <Text style={{ color: "white" }}>Xóa</Text>
                </TouchableOpacity>
                </View>
            )}
        />

      )}
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",   // <-- viền mỏng
  },

  eventName: { fontSize: 16, fontWeight: "bold" },
  comment: { marginTop: 4, fontStyle: "italic" },
  date: { marginTop: 4, fontSize: 12, color: "gray" },
  deleteBtn: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  userName: { fontSize: 14, color: "blue", marginBottom: 4 },

});
