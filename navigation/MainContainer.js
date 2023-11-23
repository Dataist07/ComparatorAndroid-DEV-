import * as React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


// Screens
import SearchSupermarket from './screens/SearchSupermarket';
import SearchProducts from './screens/SearchProducts';
import PricePerSupermarket from './screens/PricePerSupermarket';
import ListCourses from './screens/ListProductsStack/ListPtoductsBySupermarket';

import ListProductsBySupermarket from './screens/ListProductsStack/ListPtoductsBySupermarket';

// stack
const SupermarketStack = createNativeStackNavigator();

function SupermarketsStack() {
  return (
    <SupermarketStack.Navigator>
      <SupermarketStack.Screen
        name="Trouvez vos supermarchés"
        component={SearchSupermarket}
      />
      
      <SupermarketStack.Screen
        name="Trouvez vos produits"
        component={SearchProducts}
      />
    </SupermarketStack.Navigator>
  )
}

const ListProductStack = createNativeStackNavigator();

function ListProductsStack() {
  return (
    <ListProductStack.Navigator>
      <ListProductStack.Screen
        name="Comparateur"
        component={PricePerSupermarket}
      />
      <ListProductStack.Screen
        name="Liste de course"
        component={ListProductsBySupermarket}
      />
    </ListProductStack.Navigator>
  )
}


// Tab bottom
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ color, focused, size }) => {
          let iconName;
          if (route.name === "Supermarchés/Produits"){
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Liste de courses"){
            iconName = focused ? "list" : "list-outline";
          }
          
          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="Supermarchés/Produits" component={SupermarketsStack} options={{ headerShown: false }}/>
      <Tab.Screen name="Liste de courses" component={ListProductsStack} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

// Main
export default function MainContainer() {
  
    return (
        <NavigationContainer>
          <TabNavigator/>
        </NavigationContainer>
    );
}