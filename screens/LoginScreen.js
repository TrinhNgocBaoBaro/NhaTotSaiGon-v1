import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Button
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import { ButtonFlex } from "../components/Button";
import AuthContext from "../context/AuthContext";
import LoadingModal from "../components/LoadingModal";

const LoginScreen = ({ route }) => {
  const { signInWithGoogle, signOut } = useContext(AuthContext);
  // const { initializing } = route.params
  
  // React.useEffect(()=>{
  //   console.log("Alo: ", initializing);
  // },[])


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/553/553416.png",
            }}
            style={styles.logo}
          />
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>Nhà Tốt</Text>
            <Text style={styles.textTitle}>Sài Gòn</Text>
          </View>
        </View>
      </View>
      <View style={{ backgroundColor: COLORS.orange }}>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tên đăng nhập <Text style={{ color: COLORS.red }}>*</Text></Text>
          <View style={styles.inputRow}>
            <Icon name="person" size={18} color={COLORS.orange} />
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tên đăng nhập"
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mật khẩu <Text style={{ color: COLORS.red }}>*</Text></Text>
          <View style={styles.inputRow}>
            <Icon name="key" size={18} color={COLORS.orange} />
            <TextInput
              style={styles.textInput}
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
        <View style={styles.registerContainer}>
          <Text style={{ fontFamily: FONTS.medium }}>Chưa có tài khoản? </Text>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={{ color: COLORS.orange, fontFamily: FONTS.bold }}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orText}>hoặc</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={signInWithGoogle}
          style={styles.googleButton}
        >
          <Image
            source={require("../assets/GoogleLogin.png")}
            style={styles.googleLogo}
          />
          <Text style={{ fontFamily: FONTS.bold }}>Đăng nhập với Google</Text>
        </TouchableOpacity>
      </View>
      </View>
      {/* <Button
      onPress={signOut}
      title="Sign out"
      color={"red"}
    /> */}
     {/* <LoadingModal modalVisible={initializing}/> */}
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  headerContainer: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 50,
    paddingVertical: 40,
    borderBottomLeftRadius: 50,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: 'flex-end',
    marginLeft: 20,
    flexDirection: "row",
    backgroundColor: COLORS.orange,
    paddingVertical: 30,
    borderRadius: 50,
  },
  logo: {
    height: 100,
    width: 100,
  },
  logoTextContainer: {
    justifyContent: "center",
    marginLeft: 10,
    flexDirection: "column",
  },
  logoText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  textTitle: {
    fontSize: 30,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    textShadowColor: "#F7AB79",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 50,
    padding: 50,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
  },
  textInput: {
    fontFamily: FONTS.medium,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flex: 1,
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  orText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.grey,
    alignSelf: "center",
    marginVertical: 25,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    padding: 10,
    width: "100%",
    backgroundColor: COLORS.greyPastel,
    elevation: 3,
    borderRadius: 10,
  },
  googleLogo: {
    height: 30,
    width: 30,
    borderRadius: 50,
    marginRight: 10,
  },
});
