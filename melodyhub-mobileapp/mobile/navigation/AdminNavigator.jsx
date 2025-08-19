import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Admin Screens
import DashBoard from '../screens/adminScreen/DashBoard';
import EventScreen from '../screens/adminScreen/EventScreen';
import ArtistScreen from '../screens/adminScreen/ArtistScreen';
import BookingScreen from '../screens/adminScreen/BookingScreen';
import CategoryScreen from '../screens/adminScreen/CategoryScreen';
import ReviewScreen from '../screens/adminScreen/ReviewScreen';
import UserScreen from '../screens/adminScreen/UserScreen';
import VenueScreen from '../screens/adminScreen/VenueScreen';
//Sài ké profile
import ProfileScreen from '../screens/appScreen/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// 🗂 Stack cho Dashboard
function DashBoardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashBoard"
        component={DashBoard}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EventScreen" component={EventScreen} options={{ title: 'Quản lý sự kiện' }} />
      <Stack.Screen name="ArtistScreen" component={ArtistScreen} options={{ title: 'Quản lý nghệ sĩ' }} />
      <Stack.Screen name="BookingScreen" component={BookingScreen} options={{ title: 'Quản lý đặt vé' }} />
      <Stack.Screen name="CategoryScreen" component={CategoryScreen} options={{ title: 'Quản lý thể loại' }} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{ title: 'Quản lý đánh giá' }} />
      <Stack.Screen name="UserScreen" component={UserScreen} options={{ title: 'Quản lý người dùng' }} />
      <Stack.Screen name="VenueScreen" component={VenueScreen} options={{ title: 'Quản lý địa điểm' }} />
    </Stack.Navigator>
  );
}


// 📌 Tabs cho Admin
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'DashboardTab') {
            iconName = 'grid-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashBoardStack}
        options={{ title: 'Bảng điều khiển' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Hồ sơ' }}
      />
    </Tab.Navigator>
  );
}


// 📌 Admin Navigator chính
export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
    </Stack.Navigator>
  );
}
