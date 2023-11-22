import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";

const flagEmojis = {
  USA: "🇺🇸",
  Canada: "🇨🇦",
  // ... other countries
};

const themes = {
  USA: {
    backgroundColor: "#002868", // A blue color from the USA flag
    textColor: "#FFFFFF", // White
    buttonColor: "#BF0A30", // A red color from the USA flag
  },
  Canada: {
    backgroundColor: "#FF0000", // Red from the Canada flag
    textColor: "#FFFFFF", // White
    buttonColor: "#FFFFFF", // White
  },
  // ... other countries
};

const CountrySelectionScreen = ({ navigation }) => {
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [theme, setTheme] = useState(themes.USA);

  useEffect(() => {
    const theme = themes[selectedCountry] || themes.USA;
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.backgroundColor, // Set the background color of the header
      },
      headerTintColor: theme.textColor, // Set the color of the header text
      headerTitleStyle: {
        fontWeight: "bold",
      },
      title: "LocalizeIt",
    });
  }, [selectedCountry, navigation]);

  const handleContinue = async () => {
    await saveCountrySelection(selectedCountry);
    navigation.navigate("Home", { country: selectedCountry });
  };

  const saveCountrySelection = async (country) => {
    try {
      await AsyncStorage.setItem("selectedCountry", country);
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Text style={styles.flag}>{flagEmojis[selectedCountry]}</Text>
      <Text style={[styles.title, { color: theme.textColor }]}>LocalizeIt</Text>
      <Text style={[styles.subtitle, { color: theme.textColor }]}>
        Select Your Country
      </Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedCountry(value)}
        items={[
          { label: "USA 🇺🇸", value: "USA" },
          { label: "Canada 🇨🇦", value: "Canada" },
          // ... other countries with emojis
        ]}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 20,
            right: 10,
          },
          placeholder: { color: theme.textColor },
        }}
        value={selectedCountry}
        useNativeAndroidPickerStyle={false}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.buttonColor }]}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  flag: {
    fontSize: 48, // Emoji size
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // ... pickerSelectStyles ...
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "green",
    paddingRight: 30, // to ensure the text is never behind the icon
    marginBottom: 20, // Add margin for iOS
  },
});

export default CountrySelectionScreen;
