import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import BusinessProductsScreen from '../screens/BusinessProductsScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigators for each tab
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Ürün Detayı" }}
      />
      <Stack.Screen
        name="BusinessProducts"
        component={BusinessProductsScreen}
        options={{ title: "İşletme Ürünleri" }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SearchMain" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Ürün Detayı" }}
      />
      <Stack.Screen
        name="BusinessProducts"
        component={BusinessProductsScreen}
        options={{ title: "İşletme Ürünleri" }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartMain" 
        component={CartScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Ürün Detayı" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack({ setUserToken }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        options={{ headerShown: false }}
      >
        {() => <ProfileScreen setUserToken={setUserToken} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function AppNavigator({ userToken, setUserToken }) {
  if (!userToken) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {() => <LoginScreen setUserToken={setUserToken} />}
          </Stack.Screen>
          <Stack.Screen
            name="Register"
            options={{ headerShown: false }}
          >
            {() => <RegisterScreen setUserToken={setUserToken} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "HomeTab") {
              iconName = "home";
            } else if (route.name === "SearchTab") {
              iconName = "search";
            } else if (route.name === "CartTab") {
              iconName = "shopping-cart";
            } else if (route.name === "ProfileTab") {
              iconName = "person";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#D32F2F",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ title: "Ana Sayfa", headerShown: false }} 
        />
        <Tab.Screen 
          name="SearchTab" 
          component={SearchStack} 
          options={{ title: "Arama", headerShown: false }} 
        />
        <Tab.Screen 
          name="CartTab" 
          component={CartStack} 
          options={{ title: "Sepetim", headerShown: false }} 
        />
        <Tab.Screen
          name="ProfileTab"
          options={{ title: "Profilim", headerShown: false }}
        >
          {() => <ProfileStack setUserToken={setUserToken} />}
        </Tab.Screen>
        <Tab.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ 
            title: "Ürün Detayı", 
            tabBarButton: () => null,
            tabBarStyle: { display: 'flex' }
          }}
        />
        <Tab.Screen
          name="BusinessProducts"
          component={BusinessProductsScreen}
          options={{ 
            title: "İşletme Ürünleri", 
            tabBarButton: () => null,
            tabBarStyle: { display: 'flex' }
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
} 