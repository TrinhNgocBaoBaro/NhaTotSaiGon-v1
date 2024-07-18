import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React from "react";
import Header from "../components/Header";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/FontAwesome";
import Icon2 from "react-native-vector-icons/MaterialIcons";
import LoadingModal from "../components/LoadingModal";
import { ButtonFloatBottom } from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import createAxios from "../utils/axios";
const API = createAxios();

const EditProfileScreen = ({ navigation, route }) => {
  const profile_id = route.params.profile_id

  const [aboutMe, setAboutMe] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = React.useState(false);

  const [name, setName] = React.useState();
  const [address, setAddress] = React.useState();
  const [phone, setPhone] = React.useState();

  const [images, setImages] = React.useState();
  const [noti, setNoti] = React.useState();

   const getDataAboutMe = async () => {
    try {
      const response = await API.get(`/account/${profile_id}`);
      if (response) {
        setAboutMe(response.data);
        await AsyncStorage.setItem('UserLoggedInData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  };

  React.useEffect(() => {
    if(aboutMe) {
      setName(aboutMe.name);
      setAddress(aboutMe.address);
      setPhone(aboutMe.phone);
    }
  }, [aboutMe]);


  React.useEffect(() => {
    if(profile_id) getDataAboutMe();
  }, [profile_id]);

  React.useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied!");
      }
    })();
  }, []);
  

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);


    if (!result.canceled) {
      setImages(result.assets[0]);
    }
  };


  const updateProfile = async () => {
    setIsLoadingUpdate(true);
    setNoti();
    try {
      const formUpdateProfile = new FormData();

      if(images) {
        const localUri = images.uri;
        const filename = localUri.split("/").pop();
        const fileExtension = filename.split(".").pop();
  
        console.log("Local Uri: ", localUri);
        console.log("File Name: ", filename);
        console.log("File Extension: ", fileExtension);
  
        formUpdateProfile.append("image", {
          uri: localUri,
          name: filename,
          type: `image/${fileExtension}`,
        });
      }
     
      formUpdateProfile.append("name", name.trim());
      formUpdateProfile.append("phone", phone.trim());
      formUpdateProfile.append("address", address.trim());


      const response = await API.putWithHeaders(`/account/${profile_id}`, 
        formUpdateProfile,
      {
          "Content-Type": "multipart/form-data",
      }
      );

      if (response) {
        console.log(response);
        getDataAboutMe();
        setNoti("Cập nhật thông tin thành công!")
        setIsLoadingUpdate(false)
       
      } else {
        console.log("Có lỗi cập nhật");
      }
    } catch (error) {
      console.log(error);
    }
  };  

  if (isLoading) {
    return <LoadingModal modalVisible={isLoading} />;
  }

  return (
    <>
      <Header
        title={"Chỉnh sửa thông tin"}
        colorBackground={COLORS.white}
        colorText={COLORS.orange}
        leftIcon={"close"}
        rightIcon={"create-outline"}
        onPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 20 }} contentContainerStyle={{paddingBottom: 100}}
      >
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View>
            <Image
              source={{
                uri: images ? images.uri || "https://img.pikbest.com/origin/09/19/03/61zpIkbEsTGjk.jpg!w700wp" : (aboutMe && aboutMe.image),
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 150,
                borderWidth: 2,
                borderColor: COLORS.orange,
              }}
            />
            <Icon2
              onPress={pickImage}
              name={"create"}
              size={22}
              color={COLORS.grey}
              style={{
                padding: 8,
                elevation: 5,
                backgroundColor: COLORS.white,
                borderRadius: 50,
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            />
          </View>
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: 18,
                marginBottom: 10,
                marginRight: 5,
              }}
            >
              {aboutMe && aboutMe.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.medium,
                fontSize: 15,
                color: COLORS.grey,
              }}
            >
              {aboutMe && aboutMe.email}
              </Text>
          </View>
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Tên hiển thị
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="person" size={20} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              placeholder="Nhập tên hiển thị"
              onChangeText={(txt)=>setName(txt)}
              value={name}

            />
          </View>
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Địa chỉ
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="location-sharp" size={20} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              placeholder="VD: 50 Lê Văn Việt, Hiệp Phú, Quận 9,..."
              onChangeText={(txt)=>setAddress(txt)}
              value={address}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>
        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Số điện thoại
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="call" size={20} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              placeholder="Nhập số điện thoại..."
              onChangeText={(txt)=>setPhone(txt)}
              value={phone}
            />
          </View>
        </View>
        <View style={{ marginBottom: 25, marginHorizontal: 40, alignItems: 'center', paddingVertical: 10, borderRadius: 5 }}>
        <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.green }}>
            {noti && noti}
          </Text>
        </View>
      </ScrollView>
      <ButtonFloatBottom title={"Cập nhật"} buttonColor={COLORS.orange} onPress={updateProfile} />
      <LoadingModal modalVisible={isLoadingUpdate} />
    </>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
