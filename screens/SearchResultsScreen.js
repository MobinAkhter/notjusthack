import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";

const SearchResultsScreen = ({ route, navigation }) => {
  const { query } = route.params;
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        // Adjust this query to match your data structure and searching needs
        const querySnapshot = await db
          .collection("Products")
          .where("name", ">=", query)
          .where("name", "<=", query + "\uf8ff")
          .get();
        const fetchedResults = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSearchResults(fetchedResults);
      } catch (error) {
        console.log("Error searching documents:", error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={styles.item}
            onPress={() =>
              navigation.navigate("ProductDetails", { product: item })
            }
          >
            {item.name}
          </Text>
        )}
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
});

export default SearchResultsScreen;
