import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { db } from "../firebaseConfig";

const SearchResultsScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [products, setProducts] = useState([]);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductsAndAlternatives = async () => {
      setLoading(true);
      try {
        // Search for the international products
        const productsSnapshot = await db
          .collection("Products")
          .where("name", ">=", query)
          .where("name", "<=", query + "\uf8ff")
          .get();

        const fetchedProducts = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isInternational: true, // Add a flag to indicate this is an international product
        }));

        // Search for the local alternatives
        const alternativesSnapshot = await db
          .collection("LocalAlternatives")
          .where("name", ">=", query)
          .where("name", "<=", query + "\uf8ff")
          .get();

        const fetchedAlternatives = alternativesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isInternational: false,
        }));

        // Combine the results
        const combinedResults = [...fetchedProducts, ...fetchedAlternatives];
        setProducts(combinedResults);
      } catch (error) {
        console.log("Error fetching products and alternatives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndAlternatives();
  }, [query]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("ProductDetails", { product: item })}
    >
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>
        {item.isInternational ? "International" : "Local Alternative"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "grey",
  },
});

export default SearchResultsScreen;
