import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Footer = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.textStyle}>
                © Piotr Sobol 2024
            </Text> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    textStyle: {
        fontSize: 12,
    }
});