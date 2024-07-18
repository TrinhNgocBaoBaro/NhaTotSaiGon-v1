import React from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIndicator } from "react-native-indicators";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import Icon from "react-native-vector-icons/Ionicons";

const ContentModal = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View
          style={[
            styles.modalView,
            props.modalStyle,
            props.darkMode && { backgroundColor: "#121212" },
          ]}
        >
          <View
            style={{
              width: 150,
              height: 150,
              backgroundColor: "#0008",
              borderRadius: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: FONTS.semiBold, fontSize: 20, color: COLORS.white }}>
              {props.title}
            </Text>

          </View>
          <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 30,
                  justifyContent: "center",
                  alignItems: 'center',
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  marginTop: 10,
                  flexDirection: 'row'
                }}
              >
                <Icon
                  name="arrow-back-outline"
                  size={20}
                  color={COLORS.white}
                />
                <Text style={{marginLeft: 5, fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.white }}>
                {"Quay lại"}
                </Text>

              </View>
            </TouchableOpacity>
          {/* {props.task ?
                        <Text style={[styles.modalText,props.fontFamily && {fontFamily:props.fontFamily}]}>{props.task}</Text>
                        :
                        <Text style={[styles.modalText,props.fontFamily && {fontFamily:props.fontFamily},props.darkMode && {color:'white'} ,props.textStyle]}>{props.title} Loading...</Text>
                    } */}
        </View>
      </View>
    </Modal>
  );
};

export default ContentModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0009",
  },
  modalView: {
    margin: 20,
    width: 200,
    height: "auto",
    backgroundColor: "transparent",
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 0,
  },

  modalText: {
    marginVertical: 15,
    textAlign: "center",
    fontSize: 17,
    marginLeft: 15,
  },
});
