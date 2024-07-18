import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
  RefreshControl
} from "react-native";
import React, { useContext } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Icon1 from "react-native-vector-icons/FontAwesome";

import { getDataAboutMe } from "../utils/api";
import FONTS from "../constants/font";
import { formatCurrency } from "../utils";

import createAxios from "../utils/axios";
import COLORS from "../constants/color";
import LoadingModal from "../components/LoadingModal";
const API = createAxios();
import AuthContext from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [aboutMe, setAboutMe] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { signOut } = useContext(AuthContext);
  const [refreshing, setRefreshing] = React.useState(false);

  // const getDataAboutMe = async () => {
  //   try {
  //     const response = await API.get(`/account/6660807eac641bc87d297c7b`);
  //     if (response) {
  //       console.log("Success get aboutMe");
  //       setAboutMe(response.data);
  //       console.log(response.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const getUserData = async () => {
  //   const UserLoggedInData = await AsyncStorage.getItem("UserLoggedInData")
  //   // console.log(UserLoggedInData)

  //   if(UserLoggedInData){
  //     let udata = JSON.parse(UserLoggedInData);
  //     setAboutMe(udata.data);
  //     setIsLoading(false);

  //     // console.log("--------udata---------")
  //     // console.log(udata)
  //     // console.log("--------udata---------")
  //   }
  //}
  const fetchDataAboutMe = async () => {
    try {
      const data = await getDataAboutMe();
      setAboutMe(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrivate = async () => {
    setAboutMe(prevState => ({
      ...prevState,
      is_private: !prevState.is_private
    }));
    try {
      const response = await API.put(`/account/${aboutMe._id}`,
        {
          is_private : !aboutMe.is_private
        }
      );
      if (response) {
        console.log("Success updatePrivate");
        await AsyncStorage.setItem('UserLoggedInData', JSON.stringify(response.data));
        // setAboutMe(prevState => ({
        //   ...prevState,
        //   is_private: !prevState.is_private
        // }));
        setAboutMe(response.data);
      }
    } catch (error) {
      console.log(error);
      setAboutMe(prevState => ({
        ...prevState,
        is_private: !prevState.is_private
      }));
      console.log("eror")
    }
  };

  React.useEffect(() => {
    fetchDataAboutMe();    
  }, []);

  React.useEffect(() => {
    if(aboutMe) setIsLoading(false);
  }, [aboutMe]);

  const cacheAndCellularItems = [
    {
      icon: "shield-checkmark-outline",
      text: "Quyền riêng tư",
      sub: "create-outline",
    },
    {
      icon: "person-circle-outline",
      text: "Thông tin tài khoản",
      sub: "create-outline",
    },
  ];
  const accountItems = [
    {
      icon: "language-outline",
      text: "Ngôn ngữ",
      sub: "chevron-forward-outline",
    },
    {
      icon: "chatbubble-ellipses-outline",
      text: "Phản hồi",
      sub: "chevron-forward-outline",
    },
    {
      icon: "star-outline",
      text: "Đánh giá ứng dụng",
      sub: "chevron-forward-outline",
    },
    {
      icon: "download-outline",
      text: "Cập nhật",
      sub: "chevron-forward-outline",
    },
  ];

  const handleLogOut = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: signOut
        },
      ],
      { cancelable: false }
    );
  };

  const renderSettingsItem = ({ icon, text, sub }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.settingsItem}
    >
      <Icon name={icon} size={24} color="grey" />
      <Text style={styles.settingsText}>
        {text}
      </Text>
      <View style={{ alignSelf: "flex-end" }}>
        <Icon
          name={sub}
          size={24}
          color="grey"
          style={{
            fontWeight: "600",
            fontSize: 24,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView>
        <View style={styles.top}>
          <Pressable onPress={() => navigation.goBack()}>
            <View style={styles.topButton}>
              <Icon name="person-outline" size={28} color={"black"} />
            </View>
          </Pressable>
          <View style={{ justifyContent: "center" }}>
            <Text style={styles.title}>Tài khoản</Text>
          </View>
          <Pressable
            style={styles.topButton}
            onPress={() => {}}
          >
            <Icon name="ellipsis-vertical" size={25} color={"black"} />
          </Pressable>
        </View>
      </SafeAreaView>
      {aboutMe ? 
            <ScrollView
            style={{ flex: 1, backgroundColor: "white" }}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchDataAboutMe}/>
            }
          >
            <View style={styles.itemCard}>
              <Image
                source={{
                  uri: aboutMe ? aboutMe.image : "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg",
                }}
                style={styles.profileImage}
              />
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>
                  {aboutMe && aboutMe.name}
                </Text>
                <Text style={styles.profileEmail}>
                {aboutMe && aboutMe.email}
                </Text>
              </View>
              <View>
                <Icon name="notifications-outline" size={26} color={"grey"} />
              </View>             
            </View>
            
    
            <View style={{ marginHorizontal: 20 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Tài khoản</Text>
                <View style={styles.sectionContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.settingsItem}
                  >
                    <Icon name={"person-circle-outline"} size={24} color="grey" />
                    <Text style={styles.settingsText}>
                      {"Thông tin tài khoản"}
                    </Text>
                    <View style={{ alignSelf: "flex-end" }}>
                      <TouchableOpacity
                      onPress={()=> navigation.navigate("EditProfile", {profile_id: aboutMe._id})}
                      >
                      <Icon
                        name={"create-outline"}
                        size={24}
                        color="grey"
                        style={{
                          fontWeight: "600",
                          fontSize: 24,
                        }}
                      />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
    
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.sectionTitle}>Cài đặt</Text>
                <View style={styles.sectionContainer}>
                  {accountItems.map((item, index) => (
                    <React.Fragment key={index}>
                      {renderSettingsItem(item)}
                    </React.Fragment>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={handleLogOut}
              >
                <View style={styles.btnContainer}>
                  <Text style={styles.btnText}>Đăng xuất</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
          :
          <LoadingModal modalVisible={isLoading}/>
      }

    </>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    height: 80,
    borderRadius: 5,
    backgroundColor: "white",
    marginVertical: 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  btnText: {
    color: "white",
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  btnContainer: {
    backgroundColor: "red",
    height: 40,
    width: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 3
  },
  top: {
    marginTop: StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    height: 80,
  },
  topButton: {
    height: 40,
    width: 40,
    marginLeft: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  profileDetails: {
    height: 100,
    marginLeft: 15,
    paddingVertical: 32,
    flex: 1,
  },
  profileName: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  profileEmail: {
    fontSize: 13,
    color: "grey",
    fontFamily: FONTS.semiBold,
  },
  sectionTitle: {
    marginVertical: 10,
    fontFamily: FONTS.bold,
  },
  sectionContainer: {
    backgroundColor: "grey",
    borderRadius: 5,
    overflow: "hidden",
    elevation: 2,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  settingsText: {
    marginLeft: 15,
    fontSize: 15,
    minWidth: 250,
    fontFamily: FONTS.semiBold,
  },
});

export default ProfileScreen;
