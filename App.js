import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import HomeScreen from "./screens/HomeScreen";
import LocalProductDetailsScreen from "./screens/LocalProductDetailsScreen";
import CountrySelectionScreen from "./screens/CountrySelectionScreen";

const Stack = createStackNavigator();

const App = () => {
  LogBox.ignoreAllLogs();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Country" component={CountrySelectionScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "LocalizeIt",
            headerLeft: () => null,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResultsScreen}
          options={{ title: "Search Results" }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: "Product Details" }}
        />
        <Stack.Screen
          name="LocalProductDetails"
          component={LocalProductDetailsScreen}
          options={{ title: "Local Product Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
