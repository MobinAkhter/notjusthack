import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { db } from "../firebaseConfig";

const ProductDetailsScreen = ({ route }) => {
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

        const fetchedAlternatives = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlternatives(fetchedAlternatives);
      } catch (error) {
        console.error("Error fetching local alternatives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlternatives();
  }, [product]);

  const renderAlternative = ({ item }) => (
    <View style={styles.alternativeItem}>
      <Image source={{ uri: item.image }} style={styles.alternativeImage} />
      <View style={styles.alternativeDetails}>
        <Text style={styles.alternativeTitle}>{item.name}</Text>
        <Text style={styles.alternativePrice}>Price: ${item.price}</Text>
        <Text style={styles.alternativeManufacturer}>
          Made by: {item.manufacturer}
        </Text>
      </View>
    </View>
  );

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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  alternativeItem: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  alternativeTitle: {
    fontSize: 18,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  alternativeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
  },
  alternativeImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  alternativeDetails: {
    flex: 1,
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  alternativePrice: {
    fontSize: 16,
    color: "green",
  },
  alternativeManufacturer: {
    fontSize: 14,
    color: "grey",
  },
});

export default ProductDetailsScreen;
