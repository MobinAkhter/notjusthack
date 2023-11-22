import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { db } from "../firebaseConfig";

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await db.collection("Products").get();
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.log("Error getting documents:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = () => {
    navigation.navigate("SearchResults", { query: searchQuery });
  };

  const getFilteredProducts = () => {
    if (selectedCategory === "All") {
      return products;
    } else {
      return products.filter(
        (product) => product.category === selectedCategory
      );
    }
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <Text>No image available</Text>
        )}
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={(value) => setSelectedCategory(value)}
        items={[
          { label: "All", value: "All" },
          { label: "Snacks", value: "Snacks" },

          { label: "Shoes", value: "Shoes" },
          { label: "Clothing", value: "Clothing" },
          { label: "Electronics", value: "Electronics" },
          // { label: "Electronics", value: "Electronics" },
          { label: "Beverages", value: "Beverages" },
          { label: "Automotive", value: "Automotive" },

          ,
        ]}
        style={pickerSelectStyles}
        placeholder={{}}
        value={selectedCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Search for products"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={getFilteredProducts()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    marginBottom: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
  },
});

export default HomeScreen;
