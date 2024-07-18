import React from 'react'
import { SafeAreaView, StyleSheet, View, Image, Text, Dimensions, Pressable, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/color';
import FONTS from '../constants/font';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height

export default function Header({ title, rightIcon, leftIcon ,onPress, onPressRight, colorText, colorBackground }) {
    return (
        <SafeAreaView>
            <View style={[styles.top,{backgroundColor: colorBackground || COLORS.orange}]}>
                <Pressable onPress={onPress}>
                    <View style={{ height: 40, width: 40, marginLeft: 20, justifyContent: 'center' }}>
                        <Icon name={leftIcon ? leftIcon : "arrow-back-outline"} size={30} color={colorText ||COLORS.white} />
                    </View>
                </Pressable>
                <View style={{ justifyContent: 'center' }}>                   
                        <Text style={[styles.textTitle, {color: colorText || COLORS.white}]}>{title}</Text>
                </View>
                <Pressable onPress={onPressRight}>
                <View 
                    style={{ 
                        marginRight: 20, 
                        width:40, 
                        height: 40,
                        justifyContent: 'center' }}>
                        <Icon name={rightIcon} size={30} color={colorText ||COLORS.white} />
                </View>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    top: {
        // marginTop: windowHeight * 0.03,
        marginTop: StatusBar.currentHeight,
        // marginTop: windowHeight * 0.06,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.orange,
        height: 80
    },

    textTitle: {
        fontSize: 22,
        color: COLORS.white,
        fontFamily: FONTS.bold
    },

});


