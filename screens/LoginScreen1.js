import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  Button
} from "react-native";
import React from "react";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import Icon from "react-native-vector-icons/Ionicons";
import { ButtonFlex } from "../components/Button";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "expo-dev-client"
import LoadingModal from "../components/LoadingModal";
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';


const LoginScreen = ({ navigation }) => {
  const [user, setUser] = React.useState();
  const [initializing, setInitializing] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  GoogleSignin.configure({
    webClientId:
      "283644597986-6bpm3qm5ot1rrmhie7do9kn326raeiu1.apps.googleusercontent.com",
  });

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    // return auth().signInWithCredential(googleCredential);
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) {
        setInitializing(false);
        if (user) {
            AsyncStorage.setItem(
                "UserLoggedInData",
                JSON.stringify({ user, loggedIn: true })
            )
                .then(() => {
                    navigation.navigate("Home");
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log("NO USER");
        }
    }
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    // return auth().signInWithCredential(facebookCredential);

    const user_sign_in = auth().signInWithCredential(facebookCredential);
    user_sign_in
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={{
          backgroundColor: COLORS.orange,
          paddingHorizontal: 50,
          paddingVertical: 40,
          borderBottomLeftRadius: 50,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopRightRadius: 50,
            paddingHorizontal: 50,
          }}
        ></View>
        <View
          style={{
            justifyContent: "center",
            alignItems: 'flex-end',
            marginLeft: 20,
            flexDirection: "row",
            backgroundColor: COLORS.orange,
            paddingVertical: 30,
            borderRadius: 50,
          }}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/553/553416.png",
            }}
            style={{ height: 100, width: 100 }}
          />
          <View
            style={{
              justifyContent: "center",
              marginLeft: 10,
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontFamily: FONTS.bold,
                color: COLORS.black,
                // textShadowColor: "#d5d5d5",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 5,
              }}
            >
              Nhà Tốt
            </Text>
            <Text style={styles.textTitle}>Sài Gòn</Text>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: COLORS.orange }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopRightRadius: 50,
            padding: 50,
          }}
        >
          <View style={{ marginBottom: 25 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
              Tên đăng nhập <Text style={{ color: COLORS.red }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="person" size={18} color={COLORS.orange} />
              <TextInput
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.greyPastel,
                  height: 50,
                  marginHorizontal: 10,
                  fontFamily: FONTS.medium,
                  flex: 1,
                }}
                placeholder="Nhập tên đăng nhập"
              />
            </View>
          </View>
          <View style={{ marginBottom: 25 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
              Mật khẩu <Text style={{ color: COLORS.red }}>*</Text>
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="key" size={18} color={COLORS.orange} />
              <TextInput
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.greyPastel,
                  height: 50,
                  marginHorizontal: 10,
                  fontFamily: FONTS.medium,
                  flex: 1,
                }}
                secureTextEntry={true}
                placeholder="***************"
              />
            </View>
          </View>
          <ButtonFlex
            title={"Đăng nhập"}
            stylesButton={{ paddingVertical: 15, elevation: 3 }}
            stylesText={{ fontSize: 14 }}
          />

          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontFamily: FONTS.medium }}>
              Chưa có tài khoản?{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.5}>
              <Text style={{ color: COLORS.orange, fontFamily: FONTS.bold }}>
                Đăng ký
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontFamily: FONTS.semiBold,
              fontSize: 14,
              color: COLORS.grey,
              alignSelf: "center",
              marginVertical: 25,
            }}
          >
            hoặc
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log("Signed in with Google!")
              )
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
              padding: 10,
              width: "100%",
              backgroundColor: COLORS.greyPastel,
              elevation: 3,
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../assets/GoogleLogin.png")}
              style={{
                height: 30,
                width: 30,
                borderRadius: 50,
                marginRight: 10,
              }}
            />
            <Text style={{ fontFamily: FONTS.bold }}>Đăng nhập với Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))
            }
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
              padding: 10,
              width: "100%",
              backgroundColor: COLORS.greyPastel,
              elevation: 3,
              borderRadius: 10,
            }}
          >
            {/* <Image
              source={require("../assets/GoogleLogin.png")}
              style={{
                height: 30,
                width: 30,
                borderRadius: 50,
                marginRight: 10,
              }}
            /> */}
            <Text style={{ fontFamily: FONTS.bold }}>Đăng nhập với Facebook</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
      onPress={() => {
        auth()
          .signOut()
          .then(() => console.log("User signed out!"));
        GoogleSignin.signOut();
      }}
      title="Sign out"
      color={"red"}
    />
      <LoadingModal modalVisible={false}/>

    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  textTitle: {
    fontSize: 30,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textShadowColor: "#F7AB79",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
});
