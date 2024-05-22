import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const About = () => {
    return (
        <Text style={styles.style}>
            Aplikacja mobilna przeznaczona do sterowania robotem transportowym. 
        </Text>
    );
}

const styles = StyleSheet.create({
    style: {
        width: '100%',
        padding: '10'
    }
});