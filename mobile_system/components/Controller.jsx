// * React and React Native imports:
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity,
    TextInput,
    Button,
} from 'react-native';
import { Chip } from '@rneui/themed';

// * Icons:
import Icon from 'react-native-vector-icons/Ionicons'; 

// * Joystick:
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";

export const Controller = () => {

    const [joystickValue, setJoystickValue] = useState(0);

    return(
        <View style={styles.mainContainerStyle}>
            <View 
                style={{
                    flex: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <TouchableOpacity onPress={() => console.log('Button pressed')}>
                    <Icon 
                        style={styles.iconStyle}
                        name="arrow-up-outline" size={40} color="grey" 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Button pressed')}>
                    <Icon 
                        style={styles.iconStyle}
                        name="arrow-down-outline" size={40} color="grey" 
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.containerStyle}>
                <View style={styles.joystickContainerStyle}>
                    <ReactNativeJoystick 
                        color="#a0e2f2" 
                        radius={75}     
                        onMove={(data) => {
                            setJoystickValue(Math.round(data.angle.degree));
                        }} 
                    />
                </View>
                <Text>Kąt obrotu</Text>
                <View style={styles.infoContainerStyle}>
                    <TextInput
                        editable={false}
                        value={`${joystickValue}°`}
                        style={styles.textInputStyle}
                    />
                    <TouchableOpacity onPress={() => {console.log("Angle send")}}>
                        <Icon 
                            style={styles.iconStyle}
                            name="send-outline" size={40} color="grey" 
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    containerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconStyle: {
        margin: 10
    }, 
    textInputStyle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'monospace',
        color: 'black',
        backgroundColor: 'rgb(246, 244, 245)',
        borderRadius: 5,
        margin: 5,
    }, 
    joystickContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainerStyle: {
        flexDirection: 'row',
        margin: 10,
    },
});