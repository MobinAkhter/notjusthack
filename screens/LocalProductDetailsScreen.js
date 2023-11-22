import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

const LocalProductDetailsScreen = ({ route, navigation }) => {
  const { product, globalProductName } = route.params;
  const onShare = async () => {
    let message =
      `Check out this product: ${product.name}\n` +
      `Manufactured by: ${product.manufacturer}\n` +
      `Price: $${product.price}\n` +
      `Description: ${product.description}\n` +
      `${product.image}`;

    if (globalProductName) {
      message = `Local alternative for ${globalProductName}: ${message}`;
    }

    try {
      await Share.share({
        message: message,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={onShare} style={{ marginRight: 10 }}>
          <Ionicons name="share-outline" size={28} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, onShare]);
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.manufacturer}>
        Manufactured by: {product.manufacturer}
      </Text>
      <Text style={styles.price}>Price: ${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};

export default LocalProductDetailsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover", // Cover the entire area of the image view, this looks better imo, dont need them marging
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  manufacturer: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#444",
    padding: 20,
  },
});
