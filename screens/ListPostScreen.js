import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import Icon from "react-native-vector-icons/Ionicons";
import LoadingModal from "../components/LoadingModal";
import { formatCurrency, moment } from "../utils";

import createAxios from "../utils/axios";
import FONTS from '../constants/font';
import COLORS from '../constants/color';
const API = createAxios();

const ListPostScreen = ({navigation, route}) => {
  const { user_id } = route.params;

  const [isLoading, setIsLoading] = React.useState(true);
  const [dataYourAppointment, setDataYourAppointment] = React.useState([]);

  const fetchListPost = async () => {
    try {
      const query = {"author.id": user_id };
      const response = await API.getWithQuery(`/post/`, query);
      if (response) {
        const filterData = response.data.filter((e) => {
          return e.is_active !== "false"
        });
        const arrayAfterSort = filterData.sort((a,b)=> b.time_created.localeCompare(a.time_created));
        setDataYourAppointment(arrayAfterSort);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  };

  const deletePost = async (post_id) => {
    setIsLoading(true);
    try {
      const response = await API.put(`/post/${post_id}`,
        {
          is_active: 'false',
        });
      if (response) {
        fetchListPost()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const showButtonConfirm = (post_id) =>
    Alert.alert('Xác nhận', 'Bạn có muốn xóa tin?', [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Xóa', onPress: ()=> {deletePost(post_id)}},
    ]);



  React.useEffect(() => {
    if(user_id) fetchListPost();
  }, [user_id]);
  
  return (
    <>
      <Header title={"Tin của bạn"} rightIcon={"newspaper"} onPress={()=> navigation.goBack()}/>
      {dataYourAppointment.length === 0 ?
      (isLoading ?
        <View></View>
        :
        <View style={{flex: 1, backgroundColor: COLORS.white, alignItems: 'center',justifyContent: 'center', paddingBottom: 80}}>
          <Icon name="receipt-outline" size={100} color={COLORS.darkGrey}/>
          <Text style={{fontFamily: FONTS.semiBold, color: COLORS.lightGrey, fontSize: 15, marginTop: 10,}}>Không có bài đăng.</Text>
        </View>
      )
      
      :
      <FlatList
              showsVerticalScrollIndicator={false}
              data={dataYourAppointment}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PostDetail",{post_id: item._id});
                  }}
                  onLongPress={()=> showButtonConfirm(item._id)}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 10,
                    marginTop: 0,
                    marginBottom: 5,
                    flexDirection: "row",
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.greyPastel
                  }}
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    style={{ height: 'auto', width: 120, borderRadius: 5 }}
                  />
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      paddingLeft: 20,
                      paddingTop: 5,
                    }}
                  >
                    <Text
                      style={{ fontFamily: FONTS.semiBold, fontSize: 14 }}
                      numberOfLines={2}
                    >
                      <Icon name="location-sharp" color={COLORS.orange} size={14} style={{alignSelf: 'center'}}/> 

                      {" "}{item.address}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        fontSize: 12,
                        color: COLORS.grey,
                        marginTop: 5,
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
                      {formatCurrency(item.price)} /1 tháng
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        fontSize: 12,
                        color: COLORS.grey,
                        marginTop: 5,
                        alignSelf:  'flex-end',
                      }}
                    >
                      {moment(item.time_created).fromNow()}
                    </Text>
                  </View>
  
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
              style={{ backgroundColor: COLORS.white, padding: 10 }}
      />
      }
      <LoadingModal modalVisible={isLoading} />
    </>
  )
}

export default ListPostScreen

const styles = StyleSheet.create({})