import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

const LocalProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
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

const styles = StyleSheet.create({});
