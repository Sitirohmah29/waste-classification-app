import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!res.canceled) {
      setImage(res.assets[0].uri);
      setResult(null);
      uploadImage(res.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const response = await fetch("http://10.232.252.42:5000/predict", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Gagal memproses gambar. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {image ? (
          <View style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} />

            {loading ? (
              <View style={styles.resultBox}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Menganalisis...</Text>
              </View>
            ) : result ? (
              <View style={styles.resultBox}>
                <Text style={styles.resultLabel}>Hasil: {result.label}</Text>
                <Text style={styles.resultConfidence}>
                  Akurasi: {(result.confidence * 100).toFixed(2)}%
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Belum ada gambar yang diambil
            </Text>
            <Text style={styles.subPlaceholderText}>
              Tekan tombol di bawah untuk mulai
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>📷 Ambil Gambar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 280,
    height: 280,
    borderRadius: 15,
    marginBottom: 20,
  },
  resultBox: {
    alignItems: "center",
    width: "100%",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  resultLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  resultConfidence: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  loadingText: {
    marginTop: 10,
    color: "#7f8c8d",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#95a5a6",
    marginBottom: 8,
  },
  subPlaceholderText: {
    fontSize: 14,
    color: "#bdc3c7",
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
