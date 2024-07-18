import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { DotIndicator, MaterialIndicator } from 'react-native-indicators'
import COLORS from '../constants/color'
import FONTS from '../constants/font'
import { ButtonFlex } from '../components/Button'

const DoneAppointmentScreen = ({navigation}) => {
    // const [appointment, setAppointment] = React.useState(route.params.booking);

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={{uri: "https://img.freepik.com/free-vector/appointment-booking-smartphone_23-2148559902.jpg?t=st=1717405372~exp=1717408972~hmac=22169fc907377ac6d034330a76ed26c500c08dc1f00186d09b822f53a2a92ba4&w=826"}}
            width={300}
            height={300}
        />
        <Text style={{fontFamily: FONTS.semiBold, fontSize: 20, marginBottom: 50}}>Đặt lịch hẹn thành công!</Text>
        <ButtonFlex
            title="Quay lại trang chủ"
            onPress={() => navigation.navigate("Lịch hẹn")}
            stylesButton={{ paddingVertical: 10, paddingHorizontal: 90 }}
            stylesText={{ fontSize: 15 }}
          />
      {/* <MaterialIndicator size={60} color={COLORS.white} /> */}
    </View>
  )
}

export default DoneAppointmentScreen

const styles = StyleSheet.create({})