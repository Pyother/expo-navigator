import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Map = () => {
    return(
        <View style={styles.container}>
            <Text>
                (Mapa)
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderColor: 'rgba(255, 20, 0, 0.5)',
        borderWidth: 1,
    }        
});