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
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);

  const hasAlternatives = () => alternatives.length > 0;

  const NoAlternativesMessage = () => (
    <View style={styles.noAlternativesContainer}>
      <Text style={styles.noAlternativesText}>
        No local alternatives found for this product.
      </Text>
    </View>
  );
  const getSelectedCountry = async () => {
    try {
      const country = await AsyncStorage.getItem("selectedCountry");
      if (country !== null) {
        return country;
      }
      console.error("No country found in AsyncStorage");
    } catch (error) {
      console.error("Error retrieving selected country:", error);
    }
    return null;
  };

  useEffect(() => {
    const fetchAlternatives = async () => {
      setLoading(true);
      let userCountry = route.params?.country;
      console.log("Country from route params:", userCountry);
      if (!userCountry) {
        userCountry = await getSelectedCountry();
        console.log("Country from AsyncStorage:", userCountry);
      }
      try {
        const querySnapshot = await db
          .collection("LocalAlternatives")
          .where("product_id", "==", product.id)
          .where("country", "==", userCountry)
          .get();

        if (querySnapshot.empty) {
          console.log("No alternatives found.");
        } else {
          let fetchedAlternatives = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          fetchedAlternatives.sort((a, b) => a.price - b.price);
          console.log(
            `Fetched Alternatives: ${JSON.stringify(fetchedAlternatives)}`
          );
          setAlternatives(fetchedAlternatives);
        }
      } catch (error) {
        console.error("Error fetching local alternatives:", error);
      }
      setLoading(false);
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
  const ListHeader = () => (
    <>
      <Text style={styles.title}>{product.name}</Text>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.subtitle}>Local Alternatives:</Text>
    </>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={hasAlternatives() ? alternatives : ["no-alternatives"]}
      keyExtractor={(item) => item.id || item}
      renderItem={
        hasAlternatives() ? renderAlternative : () => <NoAlternativesMessage />
      }
      ListHeaderComponent={ListHeader}
      showsVerticalScrollIndicator={false}
      ListHeaderComponentStyle={styles.listHeader}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  listHeader: {
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
  noAlternativesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noAlternativesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
});

export default ProductDetailsScreen;
