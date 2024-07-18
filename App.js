import React from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
import AuthContext, { AuthProvider } from "./context/AuthContext";

import "expo-dev-client";
import { StripeProvider } from '@stripe/stripe-react-native';

import LoginScreen1 from "./screens/LoginScreen1";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import AppointmentScreen from "./screens/AppointmentScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PostDetailScreen from "./screens/PostDetailScreen";

import COLORS from "./constants/color";
import FONTS from "./constants/font";
import CreateAppointmentScreen from "./screens/CreateAppointmentScreen";
import DoneAppointmentScreen from "./screens/DoneAppointmentScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import FavouriteScreen from "./screens/FavouriteScreen";
import SplashScreen from "./screens/SplashScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import ListPostScreen from "./screens/ListPostScreen";
import LoadingModal from "./components/LoadingModal";

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: COLORS.green, marginTop: 30, height: 70 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontFamily: FONTS.semiBold
        }}
      text2Style={{
        fontSize: 14,
        fontFamily: FONTS.medium
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  tomatoToast: ({ text1, props }) => (
    <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};


const TabRoute = ({ userId }) => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarActiveTintColor: COLORS.orange,
      tabBarInactiveTintColor: COLORS.grey,
      tabBarLabelStyle: {
        fontFamily: FONTS.semiBold,
        fontSize: 12,
        marginBottom: 5,
      },
      tabBarStyle: (route.name === 'Đăng tin' ? { display: 'none' } : {
        backgroundColor: COLORS.white,
        height: 60,
      }),
    })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        initialParams={{userId}}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? (
              <View
                style={{
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  padding: 20,
                  marginTop: -40,
                  shadowColor:COLORS.orange,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.25,
                  elevation: 4
                }}
              >
                <Icon name="newspaper" color="#fff" size={size} />
              </View>
            ): (<Icon name="home-outline" color={color} size={25} />)
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? (
              <View
                style={{
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  padding: 20,
                  marginTop: -40,
                  shadowColor: COLORS.orange,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.25,
                  elevation: 4
                }}
              >
                <Icon name="search-outline" color="#fff" size={size} />
              </View>
            ) : (
              <Icon name="search-outline" color={color} size={28} />
            );
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Đăng tin"
        component={CreatePostScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? (
              <View
                style={{
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  padding: 20,
                  marginTop: -40,
                  shadowColor: COLORS.orange,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.25,
                  elevation: 4
                }}
              >
                <Icon name="duplicate" color="#fff" size={size} />
              </View>
            ) : (
              <Icon name="duplicate-outline" color={color} size={28} />
            );
          },
          headerShown: false,
          
        }}
      />
      <Tab.Screen
        name="Lịch hẹn"
        component={AppointmentScreen}
        initialParams={{userId}}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? (
              <View
                style={{
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  padding: 20,
                  marginTop: -40,
                  shadowColor: COLORS.orange,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.25,
                  elevation: 4
                }}
              >
                <Icon name="calendar" color="#fff" size={size} />
              </View>
            ) : (
              <Icon name="calendar-outline" color={color} size={28} />
            )
          },
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return focused ? (
              <View
                style={{
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  padding: 20,
                  marginTop: -40,
                  shadowColor: COLORS.orange,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.25,
                  elevation: 4
                }}
              >
                <Icon name="person" color="#fff" size={size} />
              </View>
            ) : (
              <Icon name="person-outline" color={color} size={28} />
            );
          },
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const STRIPE_KEY = "pk_test_51PFIBzGCFOEiUw2fhze5xe5fTEVhOXW9D7DdwnjTTfXD4CIkpIkDnZMB7zpupgPfhg0uSfgygA1uB7e0scoF96Gu006h9baxGm"

export default function App() {

  const [fontsLoaded, fontError] = useFonts({
    "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    "OpenSans-Medium": require("./assets/fonts/OpenSans-Medium.ttf"),
    "OpenSans-SemiBold": require("./assets/fonts/OpenSans-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <AuthProvider>
    <StripeProvider
      publishableKey={STRIPE_KEY}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
      <AuthContext.Consumer>
      {({ user, initializing, userId }) => 
      {
        console.log("Init ở App:", initializing)
      
        // if(initializing) {
        //   return  (
        //     <Stack.Navigator screenOptions={{ headerShown: false }}>
        //       <Stack.Screen name="Splash" component={SplashScreen} />
        //     </Stack.Navigator>
        //   )
        // } else {
        //   if(user && userId){
        //     return  (
        //       <Stack.Navigator screenOptions={{ headerShown: false }}>
        //           <Stack.Screen name="Home">
        //               {props => <TabRoute {...props} userId={userId} />}
        //           </Stack.Screen>

        //             <Stack.Screen name="PostDetail" component={PostDetailScreen} initialParams={{user_id: userId}} />
        //           <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
        //           <Stack.Screen name="DoneAppointment" component={DoneAppointmentScreen} />
        //           <Stack.Screen name="CreatePost" component={CreatePostScreen} />
        //           <Stack.Screen name="Favourite" component={FavouriteScreen} />
        //           <Stack.Screen name="ListPost" component={ListPostScreen} initialParams={{user_id: userId}} />
        //           <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        //           {/* <Stack.Screen name="Splash" component={SplashScreen} />   */}
        //       </Stack.Navigator>
        //     )
        //   }else {
        //     return  (
        //       <Stack.Navigator screenOptions={{ headerShown: false }}>
        //         <Stack.Screen name="Login" component={LoginScreen}/>
        //       </Stack.Navigator>
        //     )
        //   }
        // }

      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {
        initializing ? (
          <Stack.Screen name="Splash" component={SplashScreen} />

        ) : 
        (user && userId) ? (
          <>
          <Stack.Screen name="Home">
            {props => <TabRoute {...props} userId={userId} />}
          </Stack.Screen>
          <Stack.Screen name="PostDetail" component={PostDetailScreen} initialParams={{user_id: userId}} />
          <Stack.Screen name="CreateAppointment" component={CreateAppointmentScreen} />
          <Stack.Screen name="DoneAppointment" component={DoneAppointmentScreen} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          <Stack.Screen name="Favourite" component={FavouriteScreen} initialParams={{user_id: userId}}/>
          <Stack.Screen name="ListPost" component={ListPostScreen} initialParams={{user_id: userId}} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen1} initialParams={{initializing: initializing}} />
        )}
      </Stack.Navigator>
    )
  }  
        }
        </AuthContext.Consumer>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
    </StripeProvider>
    </AuthProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
