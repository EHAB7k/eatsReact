import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    BackHandler
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import Fonts from '../../utils/Fonts';
import strings from '../../constants/lang';
;

export default class GiftCardThanks extends React.Component {

    that = this;
    constructor(props) {
        super(props);
        this.state = {
        };

        const { navigation } = props;

        this.didFocusListener = navigation.addListener(
            'didFocus',
            this.componentDidFocus,
        );
    }


    componentDidFocus = payload => {
        const { params } = payload.action;
    };

    componentDidMount() {
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );

    }

    componentWillUnmount() {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }


    handleBackButtonPressAndroid = () => {

        if (this.props.navigation.isFocused()) {
            this.goBack();
            return true;
        } else {
            return false
        }
    }

    goBack() {
        this.props.navigation.navigate('Home');
    }

    showAlert(message, duration) {
        this.setState({ autoLogin: false });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            alert(message);
        }, duration);
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                alignItems: 'center',
            }}>
                <Image resizeMode="contain"
                    style={{
                        width: wp('60%'),
                        height: wp('60%'),
                        marginTop: '20%'
                    }}
                    source={Images.thankYouIcon}
                />
                <View style={styles.headingBG}>
                    <Text
                        style={{
                            fontFamily: Fonts.primarySemibold,
                            fontSize: 28,
                            color: Colors.Black,
                            textAlign: 'center',
                            width: '70%'
                        }}>{strings.THANK_YOU}</Text>
                    <Text
                        style={{
                            paddingHorizontal: wp("2%"),
                            fontFamily: Fonts.primaryRegular,
                            color: Colors.textGrey,
                            fontSize: 15,
                            textAlign: 'center',
                            width: '80%',
                            marginTop: '5%'
                        }}>
                        {strings.GIFT_CARD_SUCCESS}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Home')}
                    style={{
                        height: 60,
                        width: '86%',
                        borderRadius: 30,
                        backgroundColor: Colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '8%'
                    }}>
                    <Text style={{
                        fontFamily: Fonts.primaryBold,
                        fontSize: 17,
                        color: Colors.White
                    }}>
                        {strings.HOME}
                    </Text>
                </TouchableOpacity>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    headingBG: {
        marginTop: wp('8%'),
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },
    touchableArrow: {
        marginTop: '5%'
    },
});
