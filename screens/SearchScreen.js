import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import React, { useRef } from "react";
import _ from "lodash";
import COLORS from "../constants/color";
import FONTS from "../constants/font";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { MaterialIndicator } from 'react-native-indicators'
import { ButtonFlex } from "../components/Button";
import { formatCurrency } from "../utils";

import createAxios from "../utils/axios";
const API = createAxios();

const dataPriceFilter = [
  {
    id: 1,
    price_from: 0,
    price_to: 1500000,
    data: "< 1.5 triệu",
  },
  {
    id: 2,
    price_from: 1500001,
    price_to: 3000000,
    data: "1.5 triệu - 3 triệu",
  },
  {
    id: 3,
    price_from: 3000001,
    price_to: 100000000000,
    data: "> 3 triệu",
  },
];

const dataAreaFilter = [
  {
    id: 1,
    area_from: 0,
    area_to: 19,
    data: "Dưới 20 m²",
  },
  {
    id: 2,
    area_from: 20,
    area_to: 30,
    data: "20 - 30 m²",
  },
  {
    id: 3,
    area_from: 30,
    area_to: 40,
    data: "30 - 40 m²",
  },
  {
    id: 4,
    area_from: 40,
    area_to: 50,
    data: "40 - 50 m²",
  },
  {
    id: 5,
    area_from: 50,
    area_to: 1000000000000,
    data: "Trên 50 m²",
  },
];

const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const SearchScreen = ({navigation}) => {
  const [showModalFilters, setShowModalFilters] = React.useState(false);
  const [priceFilter, setPriceFilter] = React.useState();
  const [areaFilter, setAreaFilter] = React.useState();
  const [textSearch, setTextSearch] = React.useState();
  const [displayList, setDisplayList] = React.useState([]);
  const [buttonLoading, setButtonLoading] = React.useState(false);

  // const [areaFrom, setAreaFrom] = React.useState();
  // const [areaTo, setAreaTo] = React.useState();

  // const [priceFrom, setPriceFrom] = React.useState();
  // const [priceTo, setPriceTo] = React.useState();


  React.useEffect(() => {
    if (textSearch) {
      debouncedSearch(textSearch);
    } else {
      setDisplayList([]);
    }
  }, [textSearch, debouncedSearch]);

  const filterPost = async () => {
    setButtonLoading(true);
    try {
      const query = {};
      if (areaFilter) {
        query.area_from = areaFilter.area_from;
        query.area_to = areaFilter.area_to;
      }
      if (priceFilter) {
        query.price_from = priceFilter.price_from;
        query.price_to = priceFilter.price_to;
      }
      const response = await API.getWithQuery(`/post/`, query);
      if (response) {
        const filterData = response.data.filter((e) => {
          return e.is_active !== "false"
        });
        const arrayAfterSort = filterData.sort((a,b)=> b.time_created.localeCompare(a.time_created));
        setDisplayList(arrayAfterSort);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setShowModalFilters(!showModalFilters)
      setButtonLoading(false);
    }
  };

  const debouncedSearch = useRef(_.debounce(async (searchText) => {
    try {
      const query = { text_search: searchText };
      const response = await API.getWithQuery(`/post/search`, query);
      if (response) {
        const filterData = response.data.filter((e) => {
          return e.is_active !== "false"
        });
        const arrayAfterSort = filterData.sort((a,b)=> b.time_created.localeCompare(a.time_created));
        setDisplayList(arrayAfterSort);
        console.log("Search")
      }
    } catch (error) {
      console.log(error);
    }
  }, 500)).current;
  
  return (
    <>
      <View
        style={{ backgroundColor: COLORS.white, flex: 1,  padding: 20  }}
      >
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontFamily: FONTS.bold,
              fontSize: 25,
              color: COLORS.orange,
            }}
          >
            Tìm kiếm
          </Text>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.boxInput}>
              <TextInput
                style={styles.input}
                placeholder="Tìm kiếm đường, quận..."
                onChangeText={(txt) => setTextSearch(txt)}
                value={textSearch}
              />
              <Icon name={textSearch ? "close" : "search"} size={23} color={COLORS.grey} onPress={()=>{
                if(textSearch) {
                  setTextSearch("");
                  setDisplayList([]) 
                } 
              }}/>
            </View>
            <TouchableOpacity
              onPress={() => setShowModalFilters(true)}
              activeOpacity={0.7}
              style={{
                backgroundColor: COLORS.orange,
                borderRadius: 10,
                padding: 15,
                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="options" size={28} color={COLORS.white} />
            </TouchableOpacity>
            <Modal
              isVisible={showModalFilters}
              onBackdropPress={() => setShowModalFilters(!showModalFilters)}
              animationOutTiming={800}
              animationInTiming={300}
              animationIn={"fadeInUp"}
              animationOut={"fadeOutDown"}
              hasBackdrop={true}
            >
              <View
                style={{
                  width: "auto",
                  height: "auto",
                  backgroundColor: COLORS.white,
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text style={{ fontFamily: FONTS.semiBold, fontSize: 16 }}>
                  Lọc theo giá (VNĐ)
                </Text>
                <View
                  style={{
                    marginTop: 15,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {dataPriceFilter.map((item, index) => (
                    <Text
                      key={index}
                      onPress={() =>
                        priceFilter === item
                          ? setPriceFilter()
                          : setPriceFilter(item)
                      }
                      style={{
                        fontFamily: FONTS.medium,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: COLORS.orange,
                        borderRadius: 5,
                        color:
                          item === priceFilter ? COLORS.white : COLORS.orange,
                        backgroundColor:
                          item === priceFilter ? COLORS.orange : COLORS.white,
                      }}
                    >
                      {item.data}
                    </Text>
                  ))}
                </View>
                <Text
                  style={{
                    fontFamily: FONTS.semiBold,
                    fontSize: 16,
                    marginTop: 25,
                  }}
                >
                  Lọc theo diện tích (m²)
                </Text>

                <FlatList
                  data={formatData(dataAreaFilter, 2)}
                  style={{ marginTop: 15, marginBottom: 15 }}
                  renderItem={({ item, index }) => {
                    if (item.empty === true) {
                      return (
                        <Text
                          style={{
                            fontFamily: FONTS.medium,
                            backgroundColor: "transparent",
                            padding: 10,
                            borderRadius: 5,
                            color: COLORS.orange,
                            flex: 1,
                            margin: 5,
                            alignSelf: "center",
                          }}
                        ></Text>
                      );
                    }
                    return (
                      <Text
                        onPress={() => {
                          areaFilter === item
                            ? setAreaFilter()
                            : setAreaFilter(item);
                        }}
                        style={{
                          fontFamily: FONTS.medium,
                          padding: 10,
                          borderWidth: 1,
                          borderColor: COLORS.orange,
                          borderRadius: 5,
                          marginRight: 15,
                          width: "40%",
                          marginBottom: 10,
                          alignSelf: "center",
                          color:
                            item === areaFilter ? COLORS.white : COLORS.orange,
                          backgroundColor:
                            item === areaFilter ? COLORS.orange : COLORS.white,
                        }}
                      >
                        {item.data}
                      </Text>
                    );
                  }}
                  numColumns={2}
                  keyExtractor={(item) => item.id}
                />
                {buttonLoading ?
                <View style={{marginVertical: 20,}}>
                  <MaterialIndicator size={30} color={COLORS.orange} />
                </View>
                :
                <ButtonFlex
                  title={"Áp dụng"}
                  onPress={() => filterPost()}
                  stylesText={{ fontSize: 16, fontFamily: FONTS.semiBold }}
                  stylesButton={{ paddingVertical: 15 }}
                />
                }
              </View>
            </Modal>

          </View>
        </View>
        {displayList.length === 0 ?
         <View style={{flex: 1, backgroundColor: COLORS.white, alignItems: 'center',justifyContent: 'center', paddingBottom: 80}}>
          <Icon name="receipt-outline" size={100} color={COLORS.darkGrey}/>
          <Text style={{fontFamily: FONTS.semiBold, color: COLORS.lightGrey, fontSize: 15, marginTop: 10,}}>{textSearch || areaFilter || priceFilter ? "Không tìm thấy bài đăng." : "Nhập để tìm kiếm.."}</Text>
        </View>
       :
        <FlatList
              showsVerticalScrollIndicator={false}
              data={displayList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PostDetail", {post_id: item._id});
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 10,
                    marginTop: 10,
                    marginBottom: 5,
                    flexDirection: "row",
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.greyPastel
                  }}
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    style={{ height: 100, width: 100, borderRadius: 5 }}
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
                      style={{ fontFamily: FONTS.semiBold, fontSize: 15 }}
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
                      {formatCurrency(item.price)}/1 tháng
                    </Text>
                  </View>
  
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
              style={{ backgroundColor: COLORS.white }}
        />
      }
      </View>
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  boxInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    marginRight: 15,
    paddingRight: 15,
    paddingVertical: 8,
    backgroundColor: "#F6F6F5",
    flex: 1,
  },
  input: {
    height: 36,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 16,
    fontFamily: FONTS.medium,
    flex: 1,
  },
});
