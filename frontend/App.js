// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SearchScreen from "./src/screens/SearchScreen";
import CartScreen from "./src/screens/CartScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import BusinessProductsScreen from "./src/screens/BusinessProductsScreen";

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// ---- Home Stack (tab bar hep görünür) ----
function HomeStackNavigator({ setUserToken }) {
  return (
    <HomeStack.Navigator initialRouteName="HomeMain">
      <HomeStack.Screen
        name="HomeMain"
        options={{ headerShown: false }}
      >
        {(props) => <HomeScreen {...props} setUserToken={setUserToken} />}
      </HomeStack.Screen>

      <HomeStack.Screen
        name="BusinessProducts"
        component={BusinessProductsScreen}
        options={{
          title: "İşletme Ürünleri",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#D32F2F",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <HomeStack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: "Ürün Detayı",
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#D32F2F",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </HomeStack.Navigator>
  );
}

// ---- Bottom Tabs ----
function MainTabs({ setUserToken }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "Cart") iconName = "shopping-cart";
          else if (route.name === "Profile") iconName = "person";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#D32F2F",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeStackNavigator {...props} setUserToken={setUserToken} />}
      </Tab.Screen>

      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} setUserToken={setUserToken} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// ---- Root App ----
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setUserToken(token);
      } catch {
        setUserToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) return null; // İstersen Splash koy

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <>
            <RootStack.Screen name="Login">
              {(props) => <LoginScreen {...props} setUserToken={setUserToken} />}
            </RootStack.Screen>
            <RootStack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <RootStack.Screen name="MainTabs">
            {(props) => <MainTabs {...props} setUserToken={setUserToken} />}
          </RootStack.Screen>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

/*
Kullanım notları:
- Home içinden işletmeye geçiş: navigation.navigate('BusinessProducts', { businessId })
- İşletmeden ürün detayına:    navigation.navigate('ProductDetail', { productId })
- Diğer tablardan ürün detayı açmak istersen:
  navigation.navigate('Home', { screen: 'ProductDetail', params: { productId } });
*/
