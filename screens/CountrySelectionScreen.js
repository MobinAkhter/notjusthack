import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CountrySelectionScreen = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState("USA");

  const handleContinue = async () => {
    await saveCountrySelection(selectedCountry);
    const savedCountry = await AsyncStorage.getItem("selectedCountry");
    console.log("Saved country (check):", savedCountry);
    navigation.navigate("Home", { country: selectedCountry });
  };

  const saveCountrySelection = async (country) => {
    try {
      await AsyncStorage.setItem("selectedCountry", country);
      console.log("Country saved:", country);
      return true;
    } catch (error) {
      throw new Error("Failed to save country selection");
    }
  };

  return (
    <View style={styles.container}>
      <RNPickerSelect
        onValueChange={(value) => {
          console.log("Picker Value Changed:", value);
          setSelectedCountry(value);
        }}
        items={[
          { label: "USA", value: "USA" },
          { label: "Canada", value: "Canada" },
          // ... other countries
        ]}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 20,
            right: 10,
          },
        }}
        value={selectedCountry}
        useNativeAndroidPickerStyle={false}
      />
      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 50,
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
  },
});

export default CountrySelectionScreen;
