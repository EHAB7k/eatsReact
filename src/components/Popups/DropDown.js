import React from "react"
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import {
     heightPercentageToDP as hp, widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Colors from "../../utils/Colors";


import Fonts from "../../utils/Fonts";

const DropDown = (props) => {

     const renderItem = ({ item }) => {
          console.log("item list ", item);
          return (
               <TouchableOpacity
                    onPress={() => props.onSelect(item)}
                    style={[styles.row]} >
                    <Text style={styles.txtStyle} >{item.nameEn} </Text>
               </TouchableOpacity>
          )
     }

     return (
      
               <TouchableOpacity
                    onPress={props.onOuterPress}
                    activeOpacity={1}
                    style={[styles.myshadow, styles.popup, props.style]} >
                    <View style={[styles.center, {}]} >  
                    <Text style={[styles.txtStyle, { marginLeft:10, color:'black', fontFamily:Fonts.primarySemibold, textDecorationLine:'underline', textDecorationColor:'black'}]}>{props.heading}</Text>                      
                         <FlatList                             
                              data={props.data}
                              renderItem={renderItem}
                         />
                    </View>
               </TouchableOpacity>
         

     )
}

const styles = StyleSheet.create({
     center: {
          backgroundColor: Colors.background,
          height: hp('35%'),
          width: wp('90%'),
          paddingVertical: 10,         
          borderRadius: 10
     },

     row: {
          paddingHorizontal: 10,
          paddingVertical: 5,
          backgroundColor: Colors.background,
          borderBottomWidth: 0.5,
          borderColor: Colors.colorGray,
          margin: 2,
          borderRadius: 10
     },
     txtStyle: {
          fontSize: wp('4%'),
          color: Colors.fontColor,
          fontFamily: Fonts.Poppins_Medium,
     },
     popup: {
          position: 'absolute',
          width: wp('100%'),
          height: hp('100%'),
          backgroundColor: '#0009',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: Colors.colorGray
     },
     myshadow: {
          shadowColor: Colors.shadowColor,
          shadowOpacity: 0.2,
          shadowOffset: {
               width: 0,
               height: 0,
          },
          shadowRadius: 8.30,
          elevation: 5,
          zIndex: 2
     },
});

export default DropDown