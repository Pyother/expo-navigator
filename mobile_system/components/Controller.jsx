// * React and React Native imports:
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { move } from '../features/DataSlice.js';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// * Joystick:
import { ReactNativeJoystick } from "@korsolutions/react-native-joystick";

// * MQTT:
import init from 'react_native_mqtt';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

init({
    size: 10000,
    storageBackend: AsyncStorage,
    defaultExpires: 1000 * 3600 * 24,
    enableCache: true,
    reconnect: true,
    sync : {}
});  

export const Controller = () => {

    const dispatch = useDispatch();
    const data = useSelector(state => state.data);
    const [joystickValue, setJoystickValue] = useState(0);
    const [selectedValue, setSelectedValue] = useState(0);
    const [client, setClient] = useState(null);

    useEffect(() => {
        
        const mqttClient = new Paho.MQTT.Client('test.mosquitto.org', 8080, 'clientId');

        mqttClient.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('Connection lost → ', responseObject.errorMessage);
            }
        };

        mqttClient.onMessageArrived = (message) => {
            console.log('Message → ', message.payloadString);
        };

        mqttClient.connect({
            onSuccess: () => {
                console.log('Connected');
                mqttClient.subscribe('RTLSSystems');
            },
            onFailure: (error) => {
                console.log('Connection failed → ', error);
            }
        });

        setClient(mqttClient);

        return () => {
            if (mqttClient) {
                mqttClient.disconnect();
            }
        };
    }, []);

    const changePostion = (direction) => {

        let message;
        if(direction === -1) message = new Paho.MQTT.Message(`reqp0`);
        else message = new Paho.MQTT.Message(`reqp${direction}`);
        message.destinationName = "RTLSSystems";
        client.send(message);

        let radianAngle, deltaX, deltaY;

        if(selectedValue == 0) {
            deltaX = 0;
            deltaY = direction;
        }
        else {
            radianAngle = selectedValue * Math.PI / 180; 
            deltaX = Math.cos(radianAngle) * direction; 
            deltaY = Math.sin(radianAngle) * direction; 
        }

        if(data.length == 0) {
            dispatch(move({x: deltaX, y: deltaY}));
        } else {
            const previousPoint = data[data.length - 1];
            const nextX = previousPoint.x + deltaX;
            const nextY = previousPoint.y + deltaY;
            dispatch(move({x: nextX, y: nextY}));
        }
    }

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
                <TouchableOpacity onPress={() => changePostion(1)}>
                    <Icon
                        style={styles.iconStyle}
                        name="arrow-up-outline" size={30} color="grey" 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changePostion(-1)}>
                    <Icon 
                        style={styles.iconStyle}
                        name="arrow-down-outline" size={30} color="grey" 
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
                <Text>Wybrany kąt</Text>
                <View style={styles.infoContainerStyle}>
                    <MaterialCommunityIcons 
                        name="angle-acute" 
                        size={30} 
                        color="grey" 
                    />
                    <TextInput
                        editable={false}
                        value={`${joystickValue}°`}
                        style={styles.textInputStyle}
                    />
                    <TouchableOpacity onPress={() => {
                        let message = new Paho.MQTT.Message(`reqr${joystickValue}`);
                        message.destinationName = "RTLSSystems";
                        client.send(message);
                        setSelectedValue(joystickValue);
                    }}>
                        <Icon 
                            style={{
                                backgroundColor: 'rgb(246, 244, 245)',
                                borderRadius: 5,
                                padding: 5,
                                marginLeft: 10,
                                marginRight: 10
                            }}
                            name="send-outline" size={30} color="grey" 
                        />
                    </TouchableOpacity>
                </View>
                <Text>Ustawiony kąt</Text> 
                <View style={styles.infoContainerStyle}>
                    <MaterialCommunityIcons 
                        name="bullseye-arrow" 
                        size={30} 
                        color="grey" 
                    />
                    <TextInput
                        editable={false}
                        value={`${selectedValue}°`}
                        style={styles.angleInfoStyle}
                    />
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
        backgroundColor: 'rgb(246, 244, 245)',
        borderRadius: 5,
        padding: 5,
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
        marginLeft: 10,
        height: 40
    }, 
    joystickContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 10,
    },
    angleInfoStyle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'monospace',
        color: 'black',
        backgroundColor: 'rgb(246, 244, 245)',
        borderRadius: 5,
        marginLeft: 10,
        marginRight: 10,
        height: 40
    }
});