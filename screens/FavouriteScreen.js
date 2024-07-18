import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Header from "../components/Header";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import Icon from "react-native-vector-icons/Ionicons";
import LoadingModal from "../components/LoadingModal";
import { formatCurrency } from "../utils";
import { useIsFocused } from "@react-navigation/native";

import createAxios from "../utils/axios";
const API = createAxios();


const FavouriteScreen = ({ navigation, route }) => {

  const { user_id } = route.params
  const isFocused = useIsFocused();

  const [dataFavouritePost, setDataFavouritePost] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchFavouritePost = async () => {
    try {
      const response = await API.get(`/account/favorite-post/${user_id}`);
      if (response) {
        setDataFavouritePost(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };


  React.useEffect(() => {
    if(user_id) fetchFavouritePost()
  }, [isFocused])
  

  return (
    <>
      <Header
        title="Yêu thích"
        colorText={COLORS.orange}
        colorBackground={COLORS.white}
        rightIcon="heart"
        onPress={() => navigation.goBack()}
      />
      {dataFavouritePost.length === 0 ?
      (isLoading ?
      <View></View>
      :
      <View style={{flex: 1, backgroundColor: COLORS.white, alignItems: 'center',justifyContent: 'center', paddingBottom: 80}}>
          <Icon name="heart-dislike-outline" size={100} color={COLORS.darkGrey}/>
          <Text style={{fontFamily: FONTS.semiBold, color: COLORS.lightGrey, fontSize: 15, marginTop: 10,}}>Không có bài đăng yêu thích.</Text>
      </View>)
      :
      <FlatList
        showsVerticalScrollIndicator={false}
        data={dataFavouritePost}
        renderItem={({item, index}) =>
            (
                <TouchableOpacity
                onPress={() => {navigation.navigate("PostDetail", {post_id: item._id})}}
                activeOpacity={0.8}
                style={
                  {
                    backgroundColor: COLORS.white,
                    padding: 10,
                    marginHorizontal: 20,
                    marginTop: 10,
                    marginBottom: 5,
                    flexDirection: "row",
                    borderBottomWidth:2,
                    borderBottomColor: COLORS.greyPastel
                  }
                }
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={{ height: 100, width: 120, borderRadius: 5 }}
                />
                <View
                  style={{
                    flex: 1,
                    padding: 10,
                    paddingLeft: 20,
                    paddingTop: 5
                  }}
                >
                  <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }} numberOfLines={2}>
                    {item.address}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.semiBold,
                      fontSize: 13,
                      color: COLORS.grey,
                      marginTop: 5
                    }}
                  >
                    Diện tích: {item.area} m²
                  </Text>
                  <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        fontSize: 14,
                        color: COLORS.orange,
                        marginTop: 5,
                      }}
                    >
                      {formatCurrency(item.price)} / 1 tháng
                    </Text>
                </View>
              </TouchableOpacity>
            )
        }
        keyExtractor={(item) => item._id}
        style={{backgroundColor: COLORS.white}}
      />
      }
      <LoadingModal modalVisible={isLoading}/>

    </>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({});
