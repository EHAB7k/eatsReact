import React, { Component } from 'react'
import {
    View,
    ActivityIndicator
} from 'react-native'
import Colors from '../utils/Colors'

export const InfiniteIndicator = ({ isVisible }) => {
    if (!isVisible) return null;
    return (
        <View style={{
            width: '100%',
            marginVertical: 20,
            alignItems: 'center',
            height: 20,
        }}>
            <ActivityIndicator
                color={Colors.primary}
                size='large'
            />
        </View>
    )
}