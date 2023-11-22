import React from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SearchResultsScreen from "./screens/SearchResultsScreen";
import ProductDetailsScreen from "./screens/ProductDetailsScreen";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

const App = () => {
  LogBox.ignoreAllLogs();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
