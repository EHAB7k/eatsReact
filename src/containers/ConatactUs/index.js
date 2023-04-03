import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native';
import { StyleSheet } from 'react-native';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header } from '../../components/Header';
import { postAPI } from '../../utils/api';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Images from '../../utils/Images';

class ContactUs extends Component {
    state = {
        name: '',
        email: '',
        msg: '',
        loading: false
    }

    handleSendPress = async () => {
        const {
            name,
            email,
            msg,
        } = this.state
        this.setState({
            loading: true,
            name: '',
            email: '',
            msg: '',
        })
        try {
            const res = await postAPI('api/v1/user/contactUs', JSON.stringify({
                name,
                email,
                msg
            }));
            console.log('response API', res)
            if (res?.status_code === 200 && res?.status === 'success') {
                alert(res?.message)
            } else {
                alert(res?.message)
            }
            this.setState({
                loading: false
            })
        } catch (e) {
            this.setState({
                loading: false
            })
            console.log('Error API', e)
        }
    }

    render() {
        const {
            navigation
        } = this.props;
        const {
            name,
            email,
            msg,
            loading
        } = this.state
        return (
            <View style={styles.mainView}>
                <SafeAreaView style={{ backgroundColor: Colors.secondary }} />
                <Header
                    navigation={navigation}
                    menu
                    title='Contact Us'
                />
                <KeyboardAwareScrollView contentContainerStyle={styles.content}>
                    <Image style={styles.banner}
                        source={Images.loginLogo}
                    />
                    <Text style={styles.helpText}>
                        NEED SOME HELP
                    </Text>

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            placeholder='Name'
                            value={name}
                            onChangeText={name => this.setState({
                                name
                            })}
                        />
                    </View>

                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            value={email}
                            onChangeText={email => this.setState({
                                email
                            })}
                        />
                    </View>

                    <View style={[styles.inputView, {
                        height: 120,
                        paddingVertical: 8,
                        justifyContent: 'flex-start'
                    }]}>
                        <TextInput
                            style={styles.input}
                            placeholder='Your message here...'
                            value={msg}
                            onChangeText={msg => this.setState({
                                msg
                            })}
                        />
                    </View>

                    <TouchableOpacity
                        disabled={loading}
                        onPress={this.handleSendPress}
                        style={{
                            width: '100%',
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: Colors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10%',
                            flexDirection: 'row'
                        }}>
                        <Text style={{
                            fontFamily: Fonts.primaryBold,
                            fontSize: 18,
                            color: Colors.White
                        }}>
                            Send
                        </Text>
                        {loading && <ActivityIndicator
                            color={Colors.White}
                        />}
                    </TouchableOpacity>

                </KeyboardAwareScrollView>
            </View>
        );
    }
}

export default ContactUs;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.White
    },
    content: {
        width: '100%',
        backgroundColor: Colors.White,
        paddingHorizontal: '8%',
    },
    banner: {
        width: '60%',
        height: 180,
        alignSelf: 'center',
        marginTop: '5%',
        marginBottom: '2%',
        resizeMode: "contain"
    },
    helpText: {
        fontFamily: Fonts.primaryBold,
        fontSize: 20,
        color: Colors.textBlack,
        alignSelf: 'center',

    },
    inputView: {
        height: 50,
        width: '100%',
        backgroundColor: Colors.inputBgGray,
        borderRadius: 25,
        paddingHorizontal: '5%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '5%'
    },
    input: {
        width: '100%',
        padding: 0,
        margin: 0,
        fontSize: 16,
        fontFamily: Fonts.primaryRegular,
    },
})