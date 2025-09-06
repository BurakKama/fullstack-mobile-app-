import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const categories = [
  "Ekmek",
  "Tatlı",
  "Meyve",
  "Sebze",
  "İçecek",
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.button, selected === cat && styles.selected]}
          onPress={() => onSelect(cat)}
        >
          <Text style={[styles.text, selected === cat && styles.selectedText]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingLeft: 5,
  },
  button: {
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 12,
  },
  selected: {
    backgroundColor: "#D32F2F",
  },
  text: {
    color: "#555",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
});
