import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebaseConfig";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlternatives = async () => {
      setLoading(true);
      try {
        const querySnapshot = await db
          .collection("LocalAlternatives")
          .where("product_id", "==", product.id)
          .get();

        if (querySnapshot.empty) {
          console.log("No alternatives found.");
        }

        let fetchedAlternatives = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        fetchedAlternatives = fetchedAlternatives.sort(
          (a, b) => a.price - b.price
        );

        setAlternatives(fetchedAlternatives);
      } catch (error) {
        console.error("Error fetching local alternatives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatives();
  }, [product]);

  const renderAlternative = ({ item }) => {
    const priceDifference = item.price - product.price;
    const priceComparisonText =
      priceDifference > 0
        ? `More expensive by $${priceDifference.toFixed(2)}`
        : priceDifference < 0
        ? `Cheaper by $${Math.abs(priceDifference).toFixed(2)}`
        : "Same price";

    const priceComparisonStyle = {
      fontSize: 14,
      fontWeight: "600",
      color:
        priceDifference > 0 ? "red" : priceDifference < 0 ? "green" : "black",
      marginBottom: 4,
    };

    return (
      <TouchableOpacity
        style={styles.alternativeItem}
        onPress={() =>
          navigation.navigate("LocalProductDetails", {
            product: item,
            globalProductName: product.name,
          })
        }
      >
        <Image source={{ uri: item.image }} style={styles.alternativeImage} />
        <View style={styles.alternativeDetails}>
          <Text style={styles.alternativeTitle}>{item.name}</Text>
          <Text style={styles.alternativePrice}>Price: ${item.price}</Text>
          <Text style={priceComparisonStyle}>{priceComparisonText}</Text>
          <Text style={styles.alternativeManufacturer}>
            Made by: {item.manufacturer}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.subtitle}>Local Alternatives:</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={alternatives}
        keyExtractor={(item) => item.id}
        renderItem={renderAlternative}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alternativeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fee2e2",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  alternativeImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  alternativeDetails: {
    flex: 1,
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  alternativePrice: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  alternativeManufacturer: {
    fontSize: 14,
    color: "#666",
  },
  globalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ProductDetailsScreen;
