import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Chip } from '@rneui/themed';
import * as Font from 'expo-font';

export const Header = () => {

    const [connection, setConnection] = useState(true);

    return (
        <View style={styles.headerStyle}>
            <View style={styles.leftContainerStyle}>
                <Text style={styles.titleStyle}>
                    RTLS SYSTEMS
                </Text>
                <Text style={styles.subtitleStyle}>
                    by Piotr Sobol
                </Text>
            </View>
            <View style={styles.rightContainerStyle}>
                <Chip
                    style={styles.chipStyle}
                    title="Połączenie"
                    icon={{
                        name: connection ? "check" : "close",
                        type: 'font-awesome',
                        size: 20,
                        color: connection ? 'lightgreen' : 'red'
                    }}
                    titleStyle={{ color: '#000' }} 
                    buttonStyle={{ borderColor: 'grey', backgroundColor: 'rgb(246, 244, 245)' }}
                    type="outline"
                />
            </View>
        </View> 
    );
}

const styles = StyleSheet.create({
    headerStyle: {
        padding: 20,
        width: '100%',
        flexDirection: 'row'
    },
    rightContainerStyle: {
        flex: 1,
        alignItems: 'flex-end'
    },
    titleStyle: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'monospace'
    },
    subtitleStyle: {
        fontFamily: 'monospace'
    },
});