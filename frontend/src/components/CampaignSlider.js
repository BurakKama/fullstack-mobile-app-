import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const campaigns = [
  { id: "1", image: "https://hacibabapastaneleri.com.tr/wp-content/uploads/2023/12/1slider-yatay.jpg" },
  { id: "2", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjA9WknHX0aDnro_vWQtad2TozeADGgcwXTQ&s" },
  { id: "3", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxDnbxiNYt1ljqTzfgt6VxuaFTk9i9N0K3sw&s" },
];

export default function CampaignSlider() {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {campaigns.map((item) => (
        <Image key={item.id} source={{ uri: item.image }} style={styles.image} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 35,
  },
  image: {
    width: width - 50,
    height: 180,
    borderRadius: 12,
    marginRight: 15,
    resizeMode: "cover",
  
  },
});
