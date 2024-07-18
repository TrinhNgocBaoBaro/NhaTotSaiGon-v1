import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, Button } from "react-native";
import React from "react";
import Header from "../components/Header";
import { ScrollView } from "react-native-gesture-handler";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import Icon from "react-native-vector-icons/Ionicons";
import { ButtonFloatBottom } from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import Toast from 'react-native-toast-message';
import { useStripe } from "@stripe/stripe-react-native";
import { useIsFocused } from "@react-navigation/native";
import { getDataAboutMe } from "../utils/api";
import { formatCurrency } from "../utils";
import createAxios from "../utils/axios";
import LoadingModal from "../components/LoadingModal";
import Modal from "react-native-modal";

const API = createAxios();

const CreatePostScreen = ({navigation}) => {
    const isFocused = useIsFocused();

    const {initPaymentSheet, presentPaymentSheet } = useStripe();
    const [showModalInformation, setShowModalInformation] = React.useState(false);

    const [images, setImages] = React.useState([]);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [utilities, setUtilities] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [area, setArea] = React.useState("");
    const [address, setAdress] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const [aboutMe, setAboutMe] = React.useState();
    const [profileId, setProfileId] = React.useState();
    const [amount, setAmount] = React.useState(50000);

    const fetchDataAboutMe = async () => {
      try {
        const data = await getDataAboutMe();
        setProfileId(data._id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const getDataAuthor = async () => {
      try {
        const response = await API.get(`/account/${profileId}`);
        if (response) {
          console.log("Aboutme: ", response.data)
          setAboutMe(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    React.useEffect(() => {
      fetchDataAboutMe()
    }, []);

    
    React.useEffect(() => {
      if(profileId) getDataAuthor();
    }, [profileId]);

    const calculatePrice = () => {
      let amountForNew = amount * 0.5;
      let amountV = aboutMe.amount_spent >= 100000 ? amount * 0.7 : amount

        if(aboutMe){
          return aboutMe.is_new === true ? amountForNew : amountV
        }

        return null;
    }
     
    React.useEffect(() => {
      if(aboutMe) console.log(calculatePrice())
    }, [aboutMe]);
    
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
          setImages([...images, result.assets[0]]);
        }
      };

      const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
      };

      const showButtonConfirm = () =>
        Alert.alert('Xác nhận', 'Bạn phải thanh toán để được đăng bài, bạn có muốn thanh toán?', [
          {
            text: 'Hủy',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: ()=> {openPaymentSheet();}},
        ]);

        const showToast = () => {
            Toast.show({
              type: 'success',
              text1: 'Thông báo',
              text2: 'Đăng tin thành công !👋',
            });
          }

          const createPost = async () => {
            try {
              const formCreatePost = new FormData();

              images.forEach((image) => {
                const localUri = image.uri;
                const filename = localUri.split("/").pop();
                const fileExtension = filename.split(".").pop();
          
                console.log("Local Uri: ", localUri);
                console.log("File Name: ", filename);
                console.log("File Extension: ", fileExtension);
          
                formCreatePost.append("image", {
                  uri: localUri,
                  name: filename,
                  type: `image/${fileExtension}`,
                });
              });

              const author = {
                id: aboutMe._id,
                image: aboutMe.image,
                name: aboutMe.name,
                email: aboutMe.email
            };

              formCreatePost.append("author", JSON.stringify(author));
              formCreatePost.append("title", title);
              formCreatePost.append("description", description);
              formCreatePost.append("utilities", utilities);
              formCreatePost.append("price", price);
              formCreatePost.append("area", area);
              formCreatePost.append("phone", phone);
              formCreatePost.append("address", address);
              formCreatePost.append("is_active", true);
              formCreatePost.append("fee", calculatePrice());


              console.log("formCreatePost nè: ", formCreatePost); 
              const response = await API.postWithHeaders(`/post/`, 
              formCreatePost ,
              {
                  "Content-Type": "multipart/form-data",
              }
              );
        
              if (response) {
                console.log(response);
                //lấy lại thông tin mới tránh lạm dụng
                getDataAuthor();
                showToast();
                setTitle("");
                setAdress('');
                setPhone("");
                setUtilities("");
                setPrice("");
                setArea("");
                setDescription("");
                setImages([]);
              } else {
                console.log("Có lỗi khi đăng tin");
              }
            } catch (error) {
              console.log(error);
            }
          };   

          const fetchPaymentSheetParams = async () => {
            const response = await API.post('/stripe/create-payment-intent', {
                amount: calculatePrice(), // Ví dụ: số tiền cần thanh toán (1000 cents = 10 USD)
            });
            if(response) console.log(response.clientSecret)
            const { clientSecret } = await response;
            return { clientSecret };
          };

          const initializePaymentSheet = async () => {
            const { clientSecret } = await fetchPaymentSheetParams();
              console.log("Initializing...")
            const { error } = await initPaymentSheet({
              paymentIntentClientSecret: clientSecret,
              merchantDisplayName: 'Your Merchant Name',
              style: 'alwaysDark', // Optional
            });
        
            if (!error) {
              setIsLoading(false);
            } else {
              Alert.alert(`Error code: ${error.code}`, error.message);
            }
          };

          const openPaymentSheet = async () => {
            const { error } = await presentPaymentSheet();
        
            if (error) {
              // Alert.alert(`Error code: ${error.code}`, error.message);
              console.log(`Error code: ${error.code}`, error.message)
            } else {
              // Alert.alert('Success', 'Your payment was successful!');
              createPost();
              navigation.navigate("Trang chủ")
            }
          };

          React.useEffect(() => {
           if(isFocused && aboutMe) initializePaymentSheet();
          }, [isFocused, aboutMe]);
        

  return (
    <>
      <Header
        title={"Đăng tin"}
        leftIcon={"close"}
        rightIcon={"information-circle"}
        onPress={() => navigation.goBack()}
        onPressRight={()=>setShowModalInformation(!showModalInformation)}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, backgroundColor: COLORS.white, marginBottom: 80}} contentContainerStyle={{ padding: 20}}>
      <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Tiêu đề <Text style={{ color: COLORS.red }}>*</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="reader" size={18} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              placeholder="Nhập tiêu đề..."
              onChangeText={(txt)=>setTitle(txt.trim())}
            />
          </View>
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Địa chỉ <Text style={{ color: COLORS.red }}>*</Text>
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
              onChangeText={(txt)=>setAdress(txt.trim())}

            />
          </View>
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Số điện thoại liên hệ <Text style={{ color: COLORS.red }}>*</Text>
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
              onChangeText={(txt)=>setPhone(txt.trim())}

            />
          </View>
        </View>

        <View style={{ marginBottom: 25 }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Tiện ích <Text style={{ color: COLORS.red }}></Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="layers" size={20} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              placeholder="VD: Wifi miễn phí, điện nước, gần trường học,..."
              onChangeText={(txt)=>setUtilities(txt.trim())}

            />
          </View>
        </View>


        <View style={{flexDirection: 'row'}}>
        <View style={{ marginBottom: 25, width: '50%' }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Giá phòng  (VNĐ) <Text style={{ color: COLORS.red }}>*</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="pricetags" size={18} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              inputMode="numeric"
              keyboardType="numeric"
              placeholder="VNĐ/tháng"
              onChangeText={(txt)=>setPrice(txt.trim())}

            />
          </View>
        </View>
        <View style={{ marginBottom: 25, width: '50%' }}>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Diện tích (m²) <Text style={{ color: COLORS.red }}>*</Text>
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="file-tray" size={18} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                height: 50,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                flex: 1,
              }}
              inputMode="numeric"
              keyboardType="numeric"
              placeholder="Nhập diện tích..."
              onChangeText={(txt)=>setArea(txt.trim())}

            />
          </View>
        </View>
        </View>

        <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}>
            Mô tả chi tiết
          </Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 25 }}>
            <Icon name="create-outline" size={20} color={COLORS.orange} />
            <TextInput
              style={{
                borderBottomWidth: 2,
                borderBottomColor: COLORS.greyPastel,
                marginHorizontal: 10,
                fontFamily: FONTS.medium,
                height: 100,
                flex: 1,
              }}
              placeholder="Nhập mô tả"
              multiline
              maxLength={150}
              numberOfLines={3}
              onChangeText={(txt) => setDescription(txt.trim())}

            />
          </View>

          <View>
          <Text style={{ fontFamily: FONTS.semiBold, fontSize: 15, marginBottom: 15 }}>
            Hình ảnh ({images.length}/6)
          </Text>
              <View style={{flexDirection: 'row', justifyContent:  'flex-start', marginBottom: 20,flexWrap: 'wrap'}}>
              {images.map((image, index) => (
                    <View key={index} style={{ marginBottom: 20, width: '30%', height:100, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginRight: '3.33333333333333333333333333333333333333333333333333333333333333333%'}}>
                    {image ? 
                        <View style={{width: '100%', height: '100%'}}>
                        <Image source={{uri:  image.uri}}   width={"100%"} height={"100%"} style={{borderRadius: 5}}/>
                        <Icon name="close-circle" size={20} color={COLORS.orange} style={{position: 'absolute', right: -10, top: -10, backgroundColor: COLORS.white, borderRadius: 50}}  onPress={() => removeImage(index)} /> 

                        </View>
                        :
                        <Icon name="image-add" size={35} color={COLORS.grey}/> 
                    }
                    </View>
              ))}
              {images.length < 6 &&
                    <TouchableOpacity onPress={pickImage} style={{width: '30%', height:100, backgroundColor: COLORS.white, borderWidth: 2, borderColor: COLORS.darkGrey, alignItems: 'center', justifyContent: 'center', borderRadius: 10}}>
                        <Icon name="add" size={32} color={COLORS.grey}/>
                     </TouchableOpacity>
              }
              </View>
          </View>

      </ScrollView>
      {aboutMe && 
      <ButtonFloatBottom title={`Đăng (${formatCurrency(calculatePrice())})`} 
        buttonColor={
        images.length > 0 && title && address && utilities && price && area && description ?
        COLORS.orange : COLORS.grey
        } 
        onPress={()=>{if(images.length > 0 && title && address && utilities && price && area && description) showButtonConfirm()} }
          />
        }
      {/* <Button title="Checkout" onPress={openPaymentSheet}/> */}
      <Modal isVisible={showModalInformation} 
             onBackdropPress={()=> setShowModalInformation(!setShowModalInformation)}
             animationOutTiming={300}
             animationInTiming={300}
             hasBackdrop={true}
             backdropColor="#f5f5f5"
             animationIn={"fadeInUp"}
             animationOut={"fadeOut"}
      >
        <View style={{width: 'auto', height: 'auto', backgroundColor: COLORS.white, borderRadius: 10, padding: 20, borderWidth: 2, borderColor: COLORS.orange}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Text style={{fontFamily: FONTS.semiBold, fontSize: 18}}>Thông tin đăng tin</Text>
          <Icon name="close-circle" size={34} color={COLORS.orange} onPress={()=> setShowModalInformation(!showModalInformation)}/>
          </View>
          <View style={{marginTop: 20,}}>
            <Text style={{fontFamily: FONTS.semiBold, marginBottom: 5}}>- Giá đăng bài cố định: <Text style={{color: COLORS.orange, fontFamily: FONTS.bold}}>{formatCurrency(amount)}</Text> / 1 tin.</Text>
            <Text style={{fontFamily: FONTS.semiBold, marginBottom: 5}}>- Đối với khách hàng mới: giảm giá <Text style={{color: COLORS.green, fontFamily: FONTS.bold}}>50%</Text> cho bài đăng đầu tiên.</Text>
            <Text style={{fontFamily: FONTS.semiBold, marginBottom: 20}}>- Với số tiền đã dùng trên <Text style={{color: COLORS.orange, fontFamily: FONTS.bold}}>{formatCurrency(100000)}</Text>: giảm giá <Text style={{color: COLORS.green, fontFamily: FONTS.bold}}>30%</Text> trên mỗi bài đăng.</Text>
            <View style={{flexDirection: 'row', marginBottom: 5}}>
              <Text style={{fontFamily: FONTS.semiBold, marginBottom: 5}}>Số tiền bạn đã dùng: </Text>
              <Text style={{color: COLORS.orange, fontFamily: FONTS.bold}}>{formatCurrency(aboutMe && aboutMe.amount_spent)}</Text>
            </View>
          </View>
        </View>
      </Modal>
      <LoadingModal modalVisible={isLoading}/>
    </>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({});
