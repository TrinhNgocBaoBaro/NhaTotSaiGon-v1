import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
// import LoadingModal from "../components/LoadingModal";
import COLORS from "../constants/color";
const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  return (
    <>
      <ScrollView style={{ backgroundColor: COLORS.white, flex: 1 }}>
        {/* <LoadingModal modalVisible={true} color={'white'} /> */}
        <View style={{ width: width, height: height }}>
          <Image
            source={require("../assets/splash.png")}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
