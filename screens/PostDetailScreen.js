import {
  StyleSheet,
  View,
  Image,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import COLORS from "../constants/color";
import Swiper from "react-native-swiper";
import FONTS from "../constants/font";
import { ScrollView } from "react-native-gesture-handler";
import { ButtonFlex, ButtonFloatBottom } from "../components/Button";
import Modal from "react-native-modal";
import { formatCurrency, moment } from "../utils";
import LoadingModal from "../components/LoadingModal";
import ContentModal from "../components/ContentModal";

import { getDataAboutMe } from "../utils/api";
import createAxios from "../utils/axios";
const API = createAxios();

const PostDetailScreen = ({ navigation, route }) => {

  const { post_id, user_id } = route.params;

  React.useEffect(() => {
   console.log("User_id_initParams: ",user_id)
  }, [user_id]);

  const [showMoreDescription, setShowMoreDescription] = React.useState(false);
  const [showModalComment, setShowModalComment] = React.useState(false);
  const [showModalProfile, setShowModalProfile] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(true);
  const [isFavourite, setIsFavourite] = React.useState(null);
  const [comment, setComment] = React.useState();
  const [aboutMe, setAboutMe] = React.useState(null);
  const [profile, setProfile] = React.useState(null);

  const [postDetails, setPostDetails] = React.useState();

  const fetchPostDetails = async () => {
    try {
      const response = await API.get(`/post/${post_id}`);
      if (response) {
        setPostDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(setLoad, 500)
    }
  };

  const fetchDataAboutMe = async () => {
    try {
      const response = await API.get(`/account/${user_id}`);
      if (response) {
        setAboutMe(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkFavourite = async () => {
      const isFavourite = aboutMe.favorite_post.includes(post_id);
      setIsFavourite(isFavourite);
  };

  const createComment = async () => {
    if(!comment) return;
    try {
      const response = await API.put(`/post/comments/${post_id}`,
        {
          account_id: aboutMe._id,
          displayName: aboutMe.name,
          photoURL: aboutMe.image,
          is_private: aboutMe.is_private,
          content: comment.trim()
        });
      if (response) {
        setComment();
        setShowModalComment(!showModalComment);
      }
    } catch (error) {
      console.log(error);
    } finally {
      fetchPostDetails()
    }
  };

  const fetchDataProfile = async (account_id) => {
    setIsLoading(true)
    try {
      const response = await API.get(`/account/${account_id}`);
      if (response) {
        setProfile(response.data);
        console.log("Profile: ", response.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
      setShowModalProfile(!showModalProfile)
    }
  };

    const createFavourite = async () => {
    setIsFavourite(true)
    try {
      const response = await API.post(`/account/favorite-post/${user_id}`,
        {
          push_id: post_id
        });
      if (response) {
        console.log("Success favourite!")
      }
    } catch (error) {
      console.log(error);
      setIsFavourite(false)
    } 
  };

  const deleteFavourite = async () => {
    setIsFavourite(false)
    try {
      const response = await API.put(`/account/favorite-post/${user_id}`,
        {
          pull_id: post_id
        });
      if (response) {
        console.log("Success delete favourite!")
      }
    } catch (error) {
      console.log(error);
      setIsFavourite(true)
    } 
  };


  const deletePost = async () => {
    setIsLoading(true);
    try {
      const response = await API.put(`/post/${post_id}`,
        {
          is_active: 'false',
        });
      if (response) {
        fetchPostDetails();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const showButtonConfirmDelete = () =>
    Alert.alert('Xác nhận', 'Bạn có muốn xóa tin?', [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Xóa', onPress: ()=> {deletePost()}},
    ]);

  const setLoad = () => setIsLoading(false);

  
  React.useEffect(() => {
    if(user_id) fetchDataAboutMe();
    if(post_id) fetchPostDetails();    
  }, []);

  React.useEffect(() => {
    if(aboutMe && post_id) checkFavourite();
  }, [aboutMe, post_id]);



  return (
    <>
      {postDetails && 
      <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
          marginTop: StatusBar.currentHeight,
        }}
      >
        <View style={{ height: 300 }}>
          <Swiper
            style={styles.wrapper}
            showsButtons={false}
            autoplay={true}
            activeDotColor={COLORS.orange}
            dotColor={COLORS.white}
            paginationStyle={{ marginBottom: 30 }}
          >
            {postDetails.images.map((item,index)=> (
                <View style={styles.slide} key={index}>
                <Image
                  source={{
                    uri: item,
                  }}
                  style={styles.img}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
          <View
                  style={{elevation: 2, position: 'absolute', right: 10, bottom: 50, backgroundColor: COLORS.orange, padding: 10, borderRadius: 8 }}
              >
                  <Text style={{fontFamily: FONTS.bold, color: COLORS.white, fontSize: 17}}>{formatCurrency(postDetails.price)}</Text>
              </View>
        </View>
        <View
          style={[
            styles.top,
            { position: "absolute", top: 0, left: 0, width: "100%" },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}
          >
            <View
              style={{
                height: 50,
                width: 50,
                marginLeft: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.white,
                borderRadius: 50,
              }}
            >
              <Icon name="arrow-back-outline" size={28} color={COLORS.orange} />
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row',}}>

          
          <TouchableOpacity activeOpacity={0.5} onPress={isFavourite ? deleteFavourite : createFavourite}>
            <View
              style={{
                height: 50,
                width: 50,
                marginRight: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.white,
                borderRadius: 50,
              }}
            >
              <Icon name={isFavourite ? "heart" : "heart-outline"} size={25} color={COLORS.orange} />
            </View>
          </TouchableOpacity>
          {postDetails.author.id === user_id &&
          <TouchableOpacity 
            activeOpacity={0.5} 
            onPress={showButtonConfirmDelete}>
            <View
              style={{
                height: 50,
                width: 50,
                marginRight: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.white,
                borderRadius: 50,
              }}
            >
              <Icon name={"trash-outline"} size={25} color={COLORS.orange} />
            </View>
          </TouchableOpacity>
          }
          </View>
        </View>

        <View
          style={{
            marginTop: -30,
            padding: 30,
            backgroundColor: "white",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            marginBottom: 120,
          }}
        >
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16 }} onPress={checkFavourite}>
            {postDetails.title}.
          </Text>

          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <Icon name="location-sharp" size={20} color={COLORS.orange} />
            <Text
              style={{
                fontFamily: FONTS.medium,
                marginLeft: 10,
                flexShrink: 1,
              }}
            >
               {postDetails.address}.
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon name="pricetags" size={20} color={COLORS.orange} />
            <Text
              style={{
                fontFamily: FONTS.medium,
                marginLeft: 10,
                flexShrink: 1,
              }}
            >
              {formatCurrency(postDetails.price)} / 1 tháng
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon name="call" size={20} color={COLORS.orange} />
            <Text
              style={{
                fontFamily: FONTS.medium,
                marginLeft: 10,
                flexShrink: 1,
              }}
            >
              {postDetails.phone}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon name="layers" size={20} color={COLORS.orange} />
            <Text
              style={{
                fontFamily: FONTS.medium,
                marginLeft: 10,
                flexShrink: 1,
              }}
            >
              Tiện ích: {postDetails.utilities}.
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Icon name="file-tray" size={20} color={COLORS.orange} />
            <Text
              style={{
                fontFamily: FONTS.medium,
                marginLeft: 10,
                flexShrink: 1,
              }}
            >
              Diện tích: {postDetails.area} m²
            </Text>
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={{ fontFamily: FONTS.bold, fontSize: 15 }}>
              Mô tả chi tiết
            </Text>
            <Text style={{ fontFamily: FONTS.medium, fontSize: 13, marginTop: 10, lineHeight: 30 }} numberOfLines={showMoreDescription ? undefined : 2}>
            {postDetails.description}.
            </Text>
            <TouchableOpacity
              onPress={()=> setShowMoreDescription(!showMoreDescription)}
            >
            <Text style={{fontFamily: FONTS.semiBold, marginTop: 5, color: COLORS.blue}}>
              {showMoreDescription ? 'Ẩn bớt' : 'Xem thêm'}
            </Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 14, marginTop: 10, alignSelf: 'flex-end' }}>           
          {moment(postDetails.time_created).fromNow()}
          </Text>
          <TouchableOpacity 
          onPress={()=>fetchDataProfile(postDetails.author.id)}
          activeOpacity={0.5}
          style={{ flexDirection: "row", marginTop: 20 }}>
            <Image
              source={{
                uri: postDetails.author.image || "https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-1/438238559_1143642673426668_6656372791733229549_n.jpg?stp=c2.0.200.200a_dst-jpg_p200x200&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=-2s72PAG7cEQ7kNvgEXAYaA&_nc_ht=scontent.fsgn15-1.fna&oh=00_AYAE6pxdrTkzfxHAGoHxzJfSAVLf9yEAF-BEkZqeKL7DBw&oe=6660C602",
              }}
              style={{ height: 50, width: 50, borderRadius: 50 }}
            />
            <View 
              style={{ marginLeft: 10 }}
              >
              <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16 }}>
                {postDetails.author.name}
              </Text>
              <Text style={{ fontFamily: FONTS.medium, fontSize: 12, marginTop: 5, color: COLORS.grey}}>
                Người đăng tin
              </Text>
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 30 }}>
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16 }}>
              Bình luận ({postDetails.comments.length})
            </Text>
            {postDetails.comments.length > 0 ? 
            postDetails.comments.map((comment,index)=>(
            <TouchableOpacity 
            onPress={()=> !comment.is_private ? fetchDataProfile(comment.account_id) : {}}
            activeOpacity={0.5} 
            style={{ marginTop: 20, flexDirection: "row" }} key={index}>
              <Image
                source={{
                  uri: comment.is_private ? "https://i.sstatic.net/l60Hf.png" : comment.photoURL,
                }}
                style={{ height: 35, width: 35, borderRadius: 50,borderWidth: !comment.is_private ? 1:0, borderColor: COLORS.orange }}
              />
              <View style={{ marginLeft: 15, height: "auto", marginRight: 20, flex: 1,alignItems: 'flex-start',}}>
                <Text
                  style={{
                    fontFamily: FONTS.semiBold,
                    marginBottom: 5,
                    color: COLORS.orange,
                  }}
                >
                  {comment.is_private ? "Ẩn danh" : comment.displayName}
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.darkGrey,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.medium }}>
                  {comment.content}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
             ))
            : 
            <View style={{flexDirection: 'column', alignItems: 'center', height: 300, justifyContent: 'center'}}>
               <Icon name="chatbox-ellipses-outline" size={40} color={COLORS.lightGrey}/>
              <Text style={{fontFamily: FONTS.medium, color: COLORS.lightGrey, fontSize: 16, marginTop: 10}}>Chưa có bình luận</Text>
            </View>
            }
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={()=>setShowModalComment(!showModalComment)}
        activeOpacity={0.9}
        style={{position: 'absolute', bottom: 100, right: 20, backgroundColor: COLORS.orange, 
                borderRadius: 50, padding: 20, alignSelf: 'flex-end', elevation: 5}}>
        <Icon name="chatbox-ellipses" color={COLORS.white} size={30}/>
      </TouchableOpacity>
      {postDetails.author.id !== user_id &&
      <ButtonFloatBottom title="Đặt lịch hẹn" buttonColor={COLORS.orange} onPress={()=>navigation.navigate("CreateAppointment", {postDetails, aboutMe})}/> }
      <Modal isVisible={showModalComment} 
             onBackdropPress={()=> setShowModalComment(!showModalComment)}
             animationOutTiming={300}
             animationInTiming={300}

             hasBackdrop={false}
             backdropColor="#f5f5f5"
             animationIn={"fadeInUp"}
             animationOut={"fadeOut"}

      >
        <View style={{width: 'auto', height: 'auto', backgroundColor: COLORS.white, borderRadius: 10, padding: 20, borderWidth: 2, borderColor: COLORS.orange}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontFamily: FONTS.semiBold, fontSize: 18}}>Bình luận</Text>
          <Icon name="close-circle" size={34} color={COLORS.orange} onPress={()=> setShowModalComment(!showModalComment)}/>
          </View>
          <TextInput
            style={{    
              height: 56,
              paddingLeft: 25,
              fontSize: 16,
              fontFamily: FONTS.medium,
              backgroundColor: COLORS.greyPastel,
              borderRadius: 10,
              marginVertical: 20
              }}
            placeholder="Aa..."
            maxLength={80}
            onChangeText={(txt)=>setComment(txt.trim())}
          />
          <ButtonFlex title={"Gửi"} onPress={createComment} 
                      stylesText={{fontSize: 16, fontFamily: FONTS.semiBold}}
                      stylesButton={{paddingVertical: 15, backgroundColor: comment ? COLORS.orange : COLORS.grey}}
          />
        </View>
      </Modal>
      <Modal isVisible={showModalProfile} 
             onBackdropPress={()=> setShowModalProfile(!showModalProfile)}
             animationOutTiming={300}
             animationInTiming={300}

             hasBackdrop={true}
             animationIn={"slideInRight"}
             animationOut={"slideOutRight"}

      >
        <View style={{overflow: 'hidden',width: '100%', height: '100%', backgroundColor: COLORS.darkGrey, borderRadius: 10, borderWidth: 0, borderColor: COLORS.orange}}>
          <View style={{backgroundColor: COLORS.orange, paddingVertical: 15, alignItems: 'center',flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
            <Icon name="person" size={25} color={COLORS.white}/>
            <Text style={{fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.white }}>Thông tin chi tiết</Text>
            <Icon name="close" size={30} color={COLORS.white} onPress={()=> setShowModalProfile(!showModalProfile)}/>
          </View>
          <View style={{ flex: 1, alignItems: 'center'}}>
          <View style={styles.grayBackground}></View>

            <View style={{padding: 5, backgroundColor: COLORS.white,  borderRadius: 150, marginTop: 50}}>
              <Image
                  source={{
                    uri: profile ? profile.image : "https://i.sstatic.net/l60Hf.png",
                  }}
                  style={{ height: 150, width: 150, borderRadius: 150}}
              />
            </View>
            <Text style={{fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.black, marginTop: 15 }}>{profile && profile.name}</Text>
            
            {/* <View style={{backgroundColor: COLORS.white, flexDirection: 'row', height: 'auto', marginHorizontal: 10}}>
            <Icon name="location-sharp" size={40} color={COLORS.orange} />
            </View> */}
<View style={{ flex: 1, alignItems: 'center', marginTop: 25}}>
    <TouchableOpacity activeOpacity={0.7} 
      style={styles.itemInfo}
    >
      <Icon name={"mail-outline"} size={40} color={COLORS.orange} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginLeft: 15,   
        }}
      >
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONTS.semiBold,
          }}
        >
          {profile && profile.email}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.7} 
      style={styles.itemInfo}
    >
      <Icon name={"call-outline"} size={40} color={COLORS.orange} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginLeft: 15,
        }}
      >
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONTS.semiBold,
          }}
        >
           {(profile && profile.phone !== "") ? profile.phone : 'Chưa có thông tin'}
           </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.7} 
      style={styles.itemInfo}
    >
      <Icon name={"location-outline"} size={40} color={COLORS.orange} />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginLeft: 15,
        }}
      >
        <Text
          style={{
            color: COLORS.black,
            fontFamily: FONTS.semiBold,
          }}
        >
           {(profile && profile.address !== "") ? profile.address : 'Chưa có thông tin'}
        </Text>
      </View>
    </TouchableOpacity>
    {/* <ButtonFlex title={"Đóng"} onPress={()=>setShowModalComment(!showModalComment)}
                      stylesText={{fontSize: 16, fontFamily: FONTS.semiBold}}
                      stylesButton={{paddingVertical: 15, paddingHorizontal: 30, backgroundColor: COLORS.orange}}
          /> */}
</View>
          </View>
         
        </View>
      </Modal>
      </>
      }

      <ContentModal modalVisible={isLoading === false && postDetails && postDetails.is_active === "false"} title={"Đã xóa"} onPress={()=>navigation.goBack()}/>
      <LoadingModal modalVisible={isLoading}/>
    </>
  );
};

export default PostDetailScreen;

const styles = StyleSheet.create({
  top: {
    // marginTop: StatusBar.currentHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    height: 80,
  },
  textTitle: {
    fontSize: 20,
    color: "white",
    fontFamily: FONTS.semiBold,
  },
  wrapper: {},
  img: {
    width: "100%",
    height: 300,
    borderRadius: 0,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  grayBackground: {
    position: "absolute",
    top: 130,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.greyPastel,
  },
  itemInfo: {
    flexDirection: "row",
    height: "auto",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 1,
    padding: 20,
  }
});
