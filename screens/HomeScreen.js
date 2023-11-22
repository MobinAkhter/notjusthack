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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = () => {
  const navigation = useNavigation();
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
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Ionicons name="menu-outline" size={28} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
          { label: "Beverages", value: "Beverages" },
          { label: "Automotive", value: "Automotive" },

          ,
        ]}
        style={pickerSelectStyles}
        placeholder={{}}
        value={selectedCategory}
      />
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Search for products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#fff",
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 4,
    fontSize: 16,
    color: "black",
  },
  item: {
    flex: 1,
    margin: 5,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 8,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    marginBottom: 8,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    borderRadius: 5,
    marginRight: 8,
    fontSize: 16,
    color: "#000",
  },
  searchButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Giving the picker some custom styling to make it look like my theme
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 4,
    color: "red",
    paddingRight: 30,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  // Won't have time to make it on Android, otherwise would put styling here
  //TODO: Add styling for Android in next release
});

export default HomeScreen;
