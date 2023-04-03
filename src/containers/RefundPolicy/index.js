import React, { Component } from 'react'
import {
    View,
    SafeAreaView,
    StyleSheet
} from 'react-native'
import { WebView } from 'react-native-webview'

import { Header } from '../../components/Header'
import Colors from '../../utils/Colors'
import { getConfiguration } from '../../utils/configuration'

class RefundPolicy extends Component {
    state = {

    }
    render() {
        const {
            navigation
        } = this.props
        const language = getConfiguration('language');
        return (
            <View style={styles.mainView}>
                <SafeAreaView style={{ backgroundColor: Colors.secondary }} />
                <Header
                    title='Refund Policy'
                    navigation={navigation}
                    menu
                />
                <WebView
                    style={styles.webViewStyle}
                    source={{
                        uri: `${getConfiguration('API_ROOT')}/api/v1/admin/refundpolicy?lang=${language}`
                    }}
                >

                </WebView>

            </View>
        );
    }
}

export default RefundPolicy;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: Colors.White
    },
    webViewStyle: {
        height: '100%',
        width: '100%',
        paddingBottom: '8%'
    }
})