import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Pressable,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import COLORS from "../constants/color";
import Icon from "react-native-vector-icons/Ionicons";
import FONTS from "../constants/font";
import TopPlacesCarousel from "../components/TopPlacesCarousel";
import { formatCurrency, moment } from "../utils";

import LoadingModal from "../components/LoadingModal";
import { useIsFocused, useRoute } from "@react-navigation/native";

import createAxios from "../utils/axios";
const API = createAxios();

const HomeScreen = ({ navigation }) => {

  const route = useRoute();
  const { userId } = route?.params;
  const isFocused = useIsFocused();
  const [newsFeed, setNewsFeed] = React.useState([]);
  const [aboutMe, setAboutMe] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [avatar, setAvatar] = React.useState();

  // const fetchAvatar = async () => {
  //   try {
  //     const data = await getAvatarUser();
  //     setAvatar(data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const getAvatar = async () => {
    try {
      const response = await API.get(`/account/${userId}`);
      if (response) {
        setAvatar(response.data.image);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNewPost = async () => {
    try {
      const response = await API.get(`/post/`);
      if (response) {
        console.log("Success get post");
        const filterData = response.data.filter((e) => {
          return e.is_active !== "false"
        });
        const arrayAfterSort = filterData.sort((a,b)=> b.time_created.localeCompare(a.time_created));
        setNewsFeed(arrayAfterSort);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    const fetchDataHome = async () => {
    try {
      await Promise.all([getAvatar(), fetchNewPost()]);
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };
  if(isFocused === true) fetchDataHome();
  }, [isFocused]);


  if (isLoading && !avatar) {
    return <LoadingModal modalVisible={isLoading} />;
  }

  return (
    <>
      <View style={styles.top}>
        <View
          style={{
            justifyContent: "center",
            marginLeft: 20,
            flexDirection: "row",
          }}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/553/553416.png",
            }}
            style={{ height: 54, width: 54 }}
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
                fontSize: 15,
                fontFamily: FONTS.bold,
                color: COLORS.grey,
                textShadowColor: "#d5d5d5",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 5,
              }}
            >
              Nhà Tốt
            </Text>
            <Text style={styles.textTitle}>Sài Gòn</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <TouchableOpacity onPress={() => {navigation.navigate("Favourite")}}>
            <View
              style={{
                marginRight: 10,
                width: 40,
                height: 40,
                justifyContent: "center",
              }}
            >
              <Icon name={"heart-outline"} size={40} color={COLORS.orange} />
            </View>
          </TouchableOpacity>
          <View style={{justifyContent: "center" }}>
            <TouchableOpacity onPress={() => {navigation.navigate("ListPost")}}>
            <View
              style={{
                marginRight: 10,
                width: 40,
                height: 40,
                justifyContent: "center",
              }}
            >
              <Icon name={"newspaper"} size={35} color={COLORS.orange} />
            </View>
          </TouchableOpacity>
          </View>
          <View style={{ marginRight: 20, justifyContent: "center" }}>
             <Pressable onPress={()=>{navigation.navigate("Tài khoản")}}>
              <Image
                source={{
                  uri: avatar ? avatar : "https://img.freepik.com/free-photo/abstract-surface-textures-white-concrete-stone-wall_74190-8189.jpg" ,
                }}
                style={{ height: 45, width: 45, borderRadius: 50 }}
              />
            </Pressable> 
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}
      >
        <TouchableOpacity activeOpacity={0.7} 
        onPress={() => {navigation.navigate("Tìm kiếm")}} 
        style={styles.boxInput}>
          <Text
            style={styles.input}
          >Tìm kiếm nhà trọ, phòng trọ...</Text>
          <Icon name="search" size={23} color={COLORS.grey} />
        </TouchableOpacity>
        <View style={{ marginVertical: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 20,
            }}
          >
            <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>
              Gợi ý cho bạn
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  fontFamily: FONTS.semiBold,
                  fontSize: 14,
                  textDecorationLine: "underline",
                  color: COLORS.grey,
                }}
              >
                Xem thêm
              </Text>
            </TouchableOpacity>
          </View>
          <TopPlacesCarousel />
        </View>
        <View style={{ marginTop: 20, marginHorizontal: 20, marginBottom: 60 }}>
        <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
          <Text style={{ fontFamily: FONTS.bold, fontSize: 18 }}>Tin mới nhất</Text>
          <TouchableOpacity onPress={()=>{}}>
              <Icon name="options" color={COLORS.grey} size={23}/>
            </TouchableOpacity>
          </View>
          {newsFeed.length > 0 && newsFeed.map((item,index)=>
           ( <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={()=> navigation.navigate("PostDetail", {post_id : item._id})}
            style={{
              marginTop: 20,
              marginBottom: 0,
              elevation: 1,
              backgroundColor: COLORS.white,
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <View style={{}}>
              <Image
                source={{
                  uri: item.images[0],
                }}
                style={{ height: 200, width: "auto" }}
              />
              <View
                  style={{elevation: 2, position: 'absolute', right: 10, bottom: 10, backgroundColor: COLORS.orange, padding: 10, borderRadius: 8 }}
              >
                  <Text style={{fontFamily: FONTS.bold, color: COLORS.white, fontSize: 17}}>{formatCurrency(item.price)}</Text>
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <View style={{ flexDirection: "row", marginBottom: 5 }}>
              <Icon name="location-sharp" size={20} color={COLORS.orange} />
                <Text style={{ fontFamily: FONTS.medium, marginLeft: 5, flexShrink: 1  }}>
                  {item.address}.
                </Text>
              </View>

              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="file-tray" size={20} color={COLORS.orange} />
                <Text style={{ fontFamily: FONTS.medium, marginLeft: 5, fontSize: 14 }}>
                  Diện tích: {item.area} m²
                </Text>
              </View>
              <Text style={{fontFamily: FONTS.semiBold, color: COLORS.grey, fontSize: 13}}>
              {moment(item.time_created).fromNow()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          )
          )}
        </View>
      </ScrollView>

    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  top: {
    marginTop: StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    height: 80,
  },

  textTitle: {
    fontSize: 24,
    color: COLORS.orange,
    fontFamily: FONTS.bold,
    textShadowColor: "#F7AB79",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  boxInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 0,
    marginRight: 15,
    marginLeft: 15,
    paddingRight: 15,
    paddingVertical: 8,
    backgroundColor: "#F6F6F5",
  },
  input: {
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.lightGrey,
    paddingVertical: 8,
    flex: 1,
  },
});
