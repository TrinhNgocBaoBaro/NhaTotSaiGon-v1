import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert, 
  TextInput,
  ScrollView
} from "react-native";
import React, { useCallback, useMemo, useRef} from "react";
import Header from "../components/Header";
import COLORS from "../constants/color";
import Icon from "react-native-vector-icons/Ionicons";
import FONTS from "../constants/font";
import { formatCurrency, moment } from "../utils";
import { ButtonFlex } from '../components/Button'
import LoadingModal from "../components/LoadingModal";
import { useIsFocused } from "@react-navigation/native";
import Modal from "react-native-modal";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView  }  from '@gorhom/bottom-sheet';

import createAxios from "../utils/axios";
const API = createAxios();


const dataTabView = [
  {
    id: 1,
    name: "Bạn hẹn",
  },
  {
    id: 2,
    name: "Khách hẹn",
  },
];

const dataFilter = [
  {
    id: "All",
    name: "Tất cả",
    icon: "calendar-outline"
  },
  {
    id: "pending",
    name: "Chờ xác nhận",
    icon: "ellipsis-horizontal-circle-outline"
  },
  {
    id: "confirmed",
    name: "Đã xác nhận",
    icon: "checkbox-outline"
  },
  {
    id: "cancelled",
    name: "Đã hủy",
    icon: "close-circle-outline"
  },
];

const AppointmentScreen = ({navigation, route}) => {
  const { userId } = route?.params
  const isFocused = useIsFocused();

  const [currentTabView, setCurrentTabView] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);

  const [dataYourAppointment, setDataYourAppointment] = React.useState([]);
  const [dataGuestAppointment, setDataGuestAppointment] = React.useState([]);
  const [displayYourAppointment, setDisplayYourAppointment] = React.useState([]);

  const [reasonCancel, setReasonCancel] = React.useState();
  const [cancelScheduleId, setCancelScheduleId] = React.useState();

  const [sortOld, setSortOld] = React.useState(false);
  const [firstClickSort, setFirstClickSort] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState('All');

  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ['50%'], []);
  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleClosePress}
      />
    ),
    []
  );

  const statusAppointment = {
    pending: { color: COLORS.blue, text: "Chờ xác nhận" },
    confirmed: { color: COLORS.green, text: "Đã xác nhận" },
    cancelled: { color: COLORS.red, text: "Đã hủy" },
  };

  const fetchAppointment = async () => {
    setIsLoading(true)
    setDisplayYourAppointment([])
    switch (currentTabView) {
      case 1:
        try {
          const response = await API.get(`/book-schedules/?renter_id=${userId}`);
          if (response) {
            const arrayAfterSort = response.data.sort((a,b)=> b.time_created.localeCompare(a.time_created));
            setDataYourAppointment(arrayAfterSort);
            setDisplayYourAppointment(arrayAfterSort);
          }
        } catch (error) {
          console.log(error);
        }finally{
          setIsLoading(false)
        }
        break;
      case 2:
        try {
          const response = await API.get(`/book-schedules/?owner_id=${userId}`);
          if (response) {
            const arrayAfterSort = response.data.sort((a,b)=> b.time_created.localeCompare(a.time_created));
            setDataGuestAppointment(arrayAfterSort);
            setDisplayYourAppointment(arrayAfterSort);
          }
        } catch (error) {
          console.log(error);
        }finally{
          setIsLoading(false)
        }
        break;
    
      default:
        break;
    }


  };

  const confirmAppointment = async (schedule_id) => {
    setIsLoading(true)
    try {
      const response = await API.put(`/book-schedules/${schedule_id}`,
        {
          status: "confirmed",
        });
      if (response) {
        console.log("Success confirm!")
        fetchAppointment();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };

  const cancelAppointment = async () => {
    setIsLoading(true)
    try {
      const response = await API.put(`/book-schedules/${cancelScheduleId}`,
        {
          status: "cancelled",
          reason_cancel: reasonCancel.trim()
        });
      if (response) {
        console.log("Success cancelled!")
        fetchAppointment();
        setReasonCancel()
        setCancelScheduleId()
        handleClosePress()
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };

  const showButtonConfirm = (schedule_id) =>
    Alert.alert('Xác nhận', 'Bạn có muốn xác nhận lịch hẹn?', [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: ()=> {confirmAppointment(schedule_id)}},
    ]);

  
  const sortYourAppointmentList = (sortOld) => {
      const arrayAfterSort = [...displayYourAppointment].sort((a,b)=> sortOld === true ? a.time_created.localeCompare(b.time_created) :  b.time_created.localeCompare(a.time_created));
      setDisplayYourAppointment(arrayAfterSort)
  }

  const filterYourAppointmentList = (status) => {
    if (status === 'All') {
      setDisplayYourAppointment(currentTabView === 1 ? dataYourAppointment : dataGuestAppointment);
    } else {
      let arrayAfterFiltered;
      currentTabView === 1 ?
       arrayAfterFiltered = [...dataYourAppointment].filter(appointment => appointment.status === status)
       :
       arrayAfterFiltered = [...dataGuestAppointment].filter(appointment => appointment.status === status)
      setDisplayYourAppointment(arrayAfterFiltered);
    }
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    filterYourAppointmentList(status);
    setFirstClickSort(false);
    setSortOld(false);
  };

  React.useEffect(() => {
    if(isFocused === true) fetchAppointment(); setFilterStatus("All"); setFirstClickSort(false); setSortOld(false)
  }, [currentTabView, isFocused])

  React.useEffect(() => {
    if(dataYourAppointment) {
      sortYourAppointmentList(sortOld);
    }
}, [sortOld])
  

  return (
    <>
      <Header
        title={"Lịch hẹn"}
        leftIcon={"calendar-outline"}
        colorBackground={COLORS.orange}
        colorText={COLORS.white}
        rightIcon={"information-circle"}
      />
      <View style={{ flexDirection: "row" }}>
        {dataTabView.map((tabView, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentTabView(tabView.id)}
            style={{
              flex: 1,
              alignItems: "center",
              alignSelf: "center",
              paddingVertical: 20,
              borderBottomWidth: currentTabView === tabView.id ? 3 : 0,
              borderBottomColor: COLORS.orange,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.semiBold,
                fontSize: 15,
                color:
                  currentTabView === tabView.id ? COLORS.orange : COLORS.black,
              }}
            >
              {tabView.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: COLORS.white,
              paddingHorizontal: 15,
              paddingTop: 15,
            }}
          >
          {dataFilter.map((itemFilter,index)=>(
          <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          style={{
            flexDirection: 'column', alignItems:'center', borderWidth: 0, borderColor: itemFilter.id === filterStatus ? COLORS.orange : COLORS.grey, borderRadius: 8, padding: 10, marginRight: 0}} 
          onPress={()=>{handleFilterChange(itemFilter.id)}}>
              <Icon name={itemFilter.icon} color={itemFilter.id === filterStatus ? COLORS.orange : COLORS.grey} size={30}/>
              <Text style={{marginTop: 5, fontFamily: FONTS.semiBold, fontSize: 13, color: itemFilter.id === filterStatus ? COLORS.orange : COLORS.grey }}>
                {itemFilter.name}
              </Text>
          </TouchableOpacity>
            ))}
         
      </View>
      {currentTabView === 1 && (
        displayYourAppointment.length === 0 ?
        (isLoading ?
          <View></View> 
          :
          <View style={{flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="calendar-outline" color={COLORS.darkGrey} size={100}/>
            <Text style={{fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.lightGrey, marginTop: 10,}}>Không có lịch hẹn.</Text>
          </View>
        )

        :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={displayYourAppointment}
          ListHeaderComponent={
            <TouchableOpacity 
            activeOpacity={0.8}
            style={{marginTop: 0,flexDirection: 'row', borderWidth: 0, borderColor: firstClickSort ? COLORS.orange : COLORS.grey, borderRadius: 50, padding: 10, backgroundColor: firstClickSort ? COLORS.white : COLORS.white, alignSelf: 'flex-end'}} 
            onPress={() => {
              setSortOld(!sortOld);
              setFirstClickSort(true);
            }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13,  color: firstClickSort ? COLORS.orange : COLORS.grey }}>{firstClickSort ? (sortOld ? "Cũ nhất" : "Mới nhất") : "Sắp xếp"} </Text>
                <Icon name="swap-vertical" color={firstClickSort ? COLORS.orange : COLORS.grey} size={18}/>
            </TouchableOpacity>
          }
          renderItem={({ item, index }) => (
            <View
              activeOpacity={0.8}
              style={{
                height: 'auto',
                backgroundColor: COLORS.white,
                marginBottom: 10,
                borderRadius: 5,
                padding: 10,
                elevation: 2,
                marginHorizontal: 5,
                marginTop: index === 0 ? 5 : 0,
                marginBottom: index === (displayYourAppointment.length - 1) ? 60: 10
              }}
            >
              <View style={{ flexDirection: "row", }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 120, height: 'auto', borderRadius: 3 }}
                  resizeMode="cover"
                />

                <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text
                      style={{
                        fontFamily: FONTS.bold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                        color: COLORS.orange
                      }}
                    >
                      Thông tin liên hệ (Cho thuê)
                    </Text>
                  <View style={{ flexDirection: "row",marginTop: 8 }}>
   
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Thời gian: {item.time}, {moment(item.date).format("DD/MM/yyyy")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row",marginTop: 8 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Số điện thoại: {item.owner_phone}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Họ tên: {item.owner_name}
                    </Text>
                  </View>

                </View>
              </View>
              <View style={{ flex: 1, marginTop: 10, }}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="location-outline" size={20} color={COLORS.orange} />
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      marginLeft: 5,
                      flexShrink: 1,
                      fontSize: 13,
                      lineHeight: 22
                    }}
                  >
                    {item.address}.
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10  }}>
                  <Icon name="file-tray-outline" size={18} color={COLORS.orange} />
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      marginLeft: 5,
                      flexShrink: 1,
                      fontSize: 13,
                    }}
                  >
                    Diện tích: {item.area} m²
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Icon name="pricetags-outline" size={18} color={COLORS.orange} />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      {formatCurrency(item.price)} / 1 tháng
                    </Text>
                </View>
                <View style={{ flexDirection: "column", marginTop: 10 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                        lineHeight: 22
                      }}
                    >
                      Ghi chú: {item.note !== "" ? item.note : "Không có" }
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center'}}>
                    <Icon name="ellipse" size={12} color={statusAppointment[item.status].color} />
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                        color: statusAppointment[item.status].color
                      }}
                    >
                      {statusAppointment[item.status].text}
                    </Text>
                </View>
                {item.status === 'cancelled' &&
                <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Lý do: {item.reason_cancel}
                    </Text>
                </View>
                }
                <View style={{ flexDirection: "column", marginTop: 10,  }}>
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        marginLeft: 5,
                        fontSize: 13,
                        color: COLORS.grey
                      }}
                    >
                      Đã tạo: {moment(item.time_created).fromNow()}
                    </Text>
                </View>
                <View style={{marginTop: 10, flex: 1, alignItems: 'flex-end',flexDirection: 'row', justifyContent: 'flex-end'}}>
                {item.status === 'pending' &&  
                <ButtonFlex
                  title="Hủy"
                  // onPress={()=>showButtonCancel(item._id)}
                  onPress={()=>{setCancelScheduleId(item._id);handleOpenPress()}}
                  stylesButton={{ paddingVertical: 8 ,backgroundColor: COLORS.white, borderWidth: 0, borderColor: COLORS.orange }}
                  stylesText={{ fontSize: 13, color: COLORS.red, fontFamily: FONTS.semiBold,  }}
                />
                }
                <ButtonFlex
                  title="Xem bài đăng"
                  onPress={() => navigation.navigate("PostDetail",{post_id: item.post_id})}
                  stylesButton={{ paddingVertical: 8 ,backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.orange}}
                  stylesText={{ fontSize: 13, color: COLORS.orange, fontFamily: FONTS.semiBold, }}
                />
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
          style={{ padding: 10, backgroundColor: COLORS.white }}
        />
      )}
      {currentTabView === 2 && (
        displayYourAppointment.length === 0 ?
        (isLoading ?
          <View></View> 
          :
          <View style={{flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center'}}>
            <Icon name="calendar-outline" color={COLORS.darkGrey} size={100}/>
            <Text style={{fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.lightGrey, marginTop: 10,}}>Không có lịch hẹn.</Text>
          </View>
        )

        :
        <FlatList
          showsVerticalScrollIndicator={false}
          data={displayYourAppointment}
          ListHeaderComponent={
            <TouchableOpacity 
            activeOpacity={0.8}
            style={{marginTop: 0,flexDirection: 'row', borderWidth: 0, borderColor: firstClickSort ? COLORS.orange : COLORS.grey, borderRadius: 50, padding: 10, backgroundColor: firstClickSort ? COLORS.white : COLORS.white, alignSelf: 'flex-end'}} 
            onPress={() => {
              setSortOld(!sortOld);
              setFirstClickSort(true);
            }}>
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 13,  color: firstClickSort ? COLORS.orange : COLORS.grey }}>{firstClickSort ? (sortOld ? "Cũ nhất" : "Mới nhất") : "Sắp xếp"} </Text>
                <Icon name="swap-vertical" color={firstClickSort ? COLORS.orange : COLORS.grey} size={18}/>
            </TouchableOpacity>
          }
          renderItem={({ item, index }) => (
            <View
              activeOpacity={0.8}
              style={{
                height: 'auto',
                backgroundColor: COLORS.white,
                marginBottom: 10,
                borderRadius: 5,
                padding: 10,
                elevation: 2,
                marginHorizontal: 5,
                marginTop: index === 0 ? 5 : 0,
                marginBottom: index === (displayYourAppointment.length - 1) ? 60: 10
              }}
            >
              <View style={{ flexDirection: "row", }}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 120, height: 'auto', borderRadius: 3 }}
                  resizeMode="cover"
                />

                <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text
                      style={{
                        fontFamily: FONTS.bold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                        color: COLORS.orange
                      }}
                    >
                      Thông tin liên hệ (Người thuê)
                    </Text>
                  <View style={{ flexDirection: "row",marginTop: 8 }}>
   
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Thời gian: {item.time}, {moment(item.date).format("DD/MM/yyyy")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row",marginTop: 8 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Số điện thoại: {item.renter_phone}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Họ tên: {item.renter_name}
                    </Text>
                  </View>

                </View>
              </View>
              <View style={{ flex: 1, marginTop: 10, }}>
                <View style={{ flexDirection: "row" }}>
                  <Icon name="location-outline" size={20} color={COLORS.orange} />
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      marginLeft: 5,
                      flexShrink: 1,
                      fontSize: 13,
                      lineHeight: 22
                    }}
                  >
                    {item.address}.
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10  }}>
                  <Icon name="file-tray-outline" size={18} color={COLORS.orange} />
                  <Text
                    style={{
                      fontFamily: FONTS.medium,
                      marginLeft: 5,
                      flexShrink: 1,
                      fontSize: 13,
                    }}
                  >
                    Diện tích: {item.area} m²
                  </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    <Icon name="pricetags-outline" size={18} color={COLORS.orange} />
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      {formatCurrency(item.price)} / 1 tháng
                    </Text>
                </View>
                <View style={{ flexDirection: "column", marginTop: 10 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                        lineHeight: 22
                      }}
                    >
                      Ghi chú: {item.note !== "" ? item.note : "Không có" }
                    </Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center'}}>
                    <Icon name="ellipse" size={12} color={statusAppointment[item.status].color} />
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                        color: statusAppointment[item.status].color
                      }}
                    >
                      {statusAppointment[item.status].text}
                    </Text>
                </View>
                {item.status === 'cancelled' &&
                <View style={{ flexDirection: "row", marginTop: 10, alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: FONTS.semiBold,
                        marginLeft: 5,
                        flexShrink: 1,
                        fontSize: 13,
                      }}
                    >
                      Lý do: {item.reason_cancel}
                    </Text>
                </View>
                }
                <View style={{ flexDirection: "column", marginTop: 10,  }}>
                    <Text
                      style={{
                        fontFamily: FONTS.medium,
                        marginLeft: 5,
                        fontSize: 13,
                        color: COLORS.grey
                      }}
                    >
                      Thời gian tạo: {moment(item.time_created).fromNow()}
                    </Text>
                </View>
                <View style={{marginTop: 10, flex: 1, alignItems: 'flex-end',flexDirection: 'row', justifyContent: 'flex-end'}}>
                <ButtonFlex
                  title="Xem bài đăng"
                  onPress={() => navigation.navigate("PostDetail",{post_id: item.post_id})}
                  stylesButton={{ paddingVertical: 8 ,backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.orange,  }}
                  stylesText={{ fontSize: 13, color: COLORS.orange, fontFamily: FONTS.semiBold,  }}
                />
                {item.status === 'pending' && 
                <ButtonFlex
                  title="Xác nhận"
                  onPress={() => showButtonConfirm(item._id)}
                  stylesButton={{ paddingVertical: 8 ,backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.orange, marginLeft: 10, }}
                  stylesText={{ fontSize: 13, color: COLORS.orange, fontFamily: FONTS.semiBold,  }}
                />
                }
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
          style={{ padding: 10, backgroundColor: COLORS.white }}
        />
      )}      
      <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
      >
      
        <BottomSheetScrollView style={{width: 'auto', height: 'auto', backgroundColor: COLORS.white, borderRadius: 10, padding: 20}}>
          <Text style={{fontFamily: FONTS.semiBold, fontSize: 18, color: COLORS.black}}>Lý do hủy</Text>
          <TextInput
            style={{    
              padding: 20,
              fontSize: 16,
              fontFamily: FONTS.medium,
              backgroundColor: COLORS.greyPastel,
              borderRadius: 10,
              marginVertical: 20, 
              minHeight: 100,
              textAlignVertical: 'top'
              }}
            placeholder="Aa..."
            maxLength={180}
            multiline={true}
            numberOfLines={5}
            onChangeText={(txt)=>setReasonCancel(txt)}
            value={reasonCancel}
          />
          <ButtonFlex title={"Xác nhận"}  
                      stylesText={{fontSize: 16, fontFamily: FONTS.semiBold}}
                      stylesButton={{paddingVertical: 15, backgroundColor: reasonCancel ?  COLORS.orange : COLORS.grey }}
                      onPress={()=> reasonCancel && cancelScheduleId && cancelAppointment()}
          />
        </BottomSheetScrollView>
        
      </BottomSheet>    

      <LoadingModal modalVisible={isLoading} />
    </>
  );
};

export default AppointmentScreen;

const styles = StyleSheet.create({});
