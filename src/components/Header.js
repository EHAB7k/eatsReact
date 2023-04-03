import React from 'react'
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import { DrawerActions } from 'react-navigation-drawer'
import Colors from '../utils/Colors'
import { getConfiguration } from '../utils/configuration'
import Fonts from '../utils/Fonts'
import Images from '../utils/Images'

export const Header = ({
    title,
    navigation,
    menu,
    hideLeftButton,
    screen,
}) => {
    const language = getConfiguration('language')
    return (
        <View style={styles.mainView}>
            {!hideLeftButton && <TouchableOpacity
                onPress={() =>
                    screen
                        ? navigation.navigate(screen)
                        : menu
                            ? navigation.dispatch(DrawerActions.openDrawer())
                            : navigation.goBack()}
                style={[styles.leftView, {
                    left: menu ? 15 : 0
                }]}>
                <Image
                    style={menu
                        ? [styles.menuIcon, {
                            transform: [{ scaleX: language === 'ar' ? -1 : 1 }]
                        }]
                        : [styles.backIcon, {
                            transform: [{ scaleX: language === 'ar' ? -1 : 1 }]
                        }]}
                    source={menu ? Images.menuIcon : Images.backImage}
                />
            </TouchableOpacity>}
            <Text style={styles.heading}>
                {title}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        height: 60,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftView: {
        position: 'absolute',
        zIndex: 2,
    },
    backIcon: {
        height: 40,
        width: 40,
        resizeMode: 'contain'
    },
    menuIcon: {
        height: 25,
        width: 25,
        resizeMode: 'contain'
    },
    heading: {
        fontFamily: Fonts.primaryBold,
        fontSize: 20,
        color: Colors.textBlack
    }
})