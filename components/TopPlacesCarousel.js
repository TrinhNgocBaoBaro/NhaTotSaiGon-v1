import React from 'react';
import {
    FlatList,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';
// import listCarousel from '../constants/listCarousel'


const listCarousel = [
    // {
    //     id: 1,
    //     image: require('./../assets/Carousel/222.webp'),
    //     title: 'Italian Breakfast Combo',
    //     subTitle: 'Zillion Reasons',
    // },
    // {
    //     id: 2,
    //     image: require('./../assets/Carousel/111.jpg'),
    //     title: 'Vegan Hangout',
    //     subTitle: 'Hotel Mayback',
    // },
    // {
    //     id: 3,
    //     image: require('./../assets/Carousel/333.jpg'),
    //     title: 'Vegan Hangout',
    //     subTitle: 'Hotel Mayback',
    // },
    // {
    //     id: 4,
    //     image: require('./../assets/Carousel/Carousel3.png'),
    //     title: 'Vegan Hangout',
    //     subTitle: 'Hotel Mayback',
    // },
    {
        id: "1",
        name: "Bơ Bán Bò",
        address: "203 Đ.Lê Văn Việt, Hiệp Phú, Quận 9",
        time: "10:00 AM - 11:00 PM",
        image: "https://file4.batdongsan.com.vn/2022/08/26/PHJN6Zw0/20220826100833-50e4.jpg",
        latitude: 10.8441, 
        longitude: 106.78288,
    },
    {
        id: "2",
        name: "No-Ne Bistro",
        address: "48 Đường Nguyễn Văn Mai, Phường 8, Quận 3",
        time: "11:30 AM - 22:30 PM",
        image: "https://pt123.cdn.static123.com/images/thumbs/900x600/fit/2021/02/22/cho-thue-phong-tro_1613975723.jpg",
        latitude: 10.790032685611157, 
        longitude: 106.68744825401734,
    },
    {
        id: "3",
        name: "A Mà Kitchen",
        address: "62 Võ Văn Tần, Phường 6, Quận 3",
        time: "10:30 AM - 21:00 PM",
        image: "https://offer.rever.vn/hubfs/cho_thue_phong_tro_moi_xay_gia_re_ngay_phuong_15_tan_binh3.jpg",
        latitude: 10.7768469439067, 
        longitude: 106.69026283867206,
    },
    {
        id: "4",
        name: "King BBQ",
        address: "50 Lê Văn Việt, Hiệp Phú, Quận 9",
        time: "10:00 AM - 09:00 PM",
        image: "https://cafefcdn.com/203337114487263232/2022/8/5/83-1659675881831241642789.jpeg",
        latitude: 10.847411218830398, 
        longitude: 106.7762775617879,
    },
    {
        id: "5",
        name: "Hanuri-Korean Fast Food",
        address: "284 Nguyễn Đình Chiểu, Phường 6, Quận 3",
        time: "099:00 AM - 11:30 PM",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU_EcqcGnIaUjkMyVVFrgxVEV8HVilApXvx0QFJZRc7wr3DbYLjpwseMEGLTjONbYe7Nk&usqp=CAU",
        latitude: 10.775871102987148, 
        longitude: 106.68727154052584,
    },
    {
        id: "6",
        name: "Kichi Kichi",
        address: "Số 338 Đỗ Xuân Hợp, Phước Long A, Quận 9",
        time: "10:00 AM - 10:00 PM",
        image: "https://vatlieuso.com/wp-content/uploads/2021/10/chi-phi-xay-nha-tro.jpg",
        latitude: 10.822944055835185, 
        longitude: 106.77066314829463,
    },
    {
        id: "7",
        name: "Maison Mận-Đỏ",
        address: "27J Đ. Trần Nhật Duật, Phường Tân Định, Quận 1",
        time: "11:00 AM - 22:00 PM",
        image: "https://baohanam-fileserver.nvcms.net/IMAGES/2023/09/13/20230913181412-97tro.jpg",
        latitude: 10.793057450832194, 
        longitude: 106.69022156701138,
    },

];

const TopPlacesCarousel = () => {
    return (
        <FlatList
            data={listCarousel}
            showsHorizontalScrollIndicator={false}
            horizontal
            keyExtractor={i => i.id}
            renderItem={({ item }) => {
                return (
                    <TouchableOpacity activeOpacity={0.5} style={{ marginLeft: 20, marginTop: 20, }}>
                        <View style={styles.card}>
                            <View style={styles.imageBox}>
                                <Image style={styles.image} source={{uri: item.image}} />
                            </View>
                            <View style={styles.titleBox}>
                                <Text style={styles.title} numberOfLines={1}>{item.address}</Text>
                                <Text style={styles.subTitle}>Xem chi tiết</Text>
                            </View>
                        </View>
                    </TouchableOpacity>)
            }}
        />
    )
}

const styles = StyleSheet.create({
    card: {
        height: 130,
        width: 250,
    },
    imageBox: {
        height: 130,
        width: 250,
        borderRadius: 20,
        overflow: 'hidden',
    },
    image: {
        height: 130,
        width: 300,
        resizeMode: 'cover',
    },
    titleBox: {
        position: 'absolute',
        left: 18,
        top: 80,
        width: '75%'
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5,
    },
    subTitle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
        textDecorationLine: 'underline',
        textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5
    }
});

export default TopPlacesCarousel;