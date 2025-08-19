import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';

// Client Screens
import HomeScreen from '../screens/appScreen/HomeScreen';
import EventListScreen from '../screens/appScreen/EventListScreen';
import BookingScreen from '../screens/appScreen/BookingScreen';
import HistoryTicket from '../screens/appScreen/HistoryTicketScreen';
import ProfileScreen from '../screens/appScreen/ProfileScreen';
//OrderBy
import OrderByVenueScreen from "../screens/appScreen/OrderBy/OrderByVenueScreen";
import OrderByCategoryScreen from "../screens/appScreen/OrderBy/OrderByCategoryScreen";
import OrderByArtistScreen from "../screens/appScreen/OrderBy/OrderByArtistScreen";



const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack cho tab Home (để giữ HomeScreen + EventList + Booking)
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Melody Hub', headerShown: false }}
      />
      <Stack.Screen
        name="EventListScreen"
        component={EventListScreen}
        options={{ title: 'Danh Sách Sự Kiện' }}
      />
      <Stack.Screen
        name="BookingEvent"
        component={BookingScreen}
        options={{ title: 'Chi tiết sự kiện' }}
      />
      <Stack.Screen name="OrderByVenueScreen" component={OrderByVenueScreen} options={{title: 'Sự kiện theo Địa điểm'}} />
      <Stack.Screen name="OrderByCategoryScreen" component={OrderByCategoryScreen} options={{title: 'Sự kiện theo Thể loại'}}/>
      <Stack.Screen name="OrderByArtistScreen" component={OrderByArtistScreen} options={{title: 'Danh sách Nghệ sĩ'}}/>
    </Stack.Navigator>
  );
}

// Tabs cho client
function ClientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTicket"
        component={HistoryTicket}
        options={{
          tabBarLabel: 'Vé của tôi',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="ticket-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Client Tabs */}
      <Stack.Screen name="ClientTabs" component={ClientTabs} />

    </Stack.Navigator>
  );
}
