// components/ImagePickerButton.js
import React from "react";
import { Button } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerButton({ onImagePicked }) {
  const pickImage = async () => {
    const res = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!res.canceled) {
      onImagePicked(res.assets[0].uri);
    }
  };

  return <Button title="Ambil Gambar" onPress={pickImage} />;
}
