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
    const [client, setClient] = useState(null);

    useEffect(() => {
        // Create MQTT client
        const mqttClient = new Paho.MQTT.Client('test.mosquitto.org', 8080, 'clientId');

        mqttClient.onConnectionLost = (responseObject) => {
            if (responseObject.errorCode !== 0) {
                console.log('onConnectionLost:', responseObject.errorMessage);
            }
        };

        mqttClient.onMessageArrived = (message) => {
            console.log('onMessageArrived:', message.payloadString);
        };

        mqttClient.connect({
            onSuccess: () => {
                console.log('connected');
                mqttClient.subscribe('myTopic');
                const message = new Paho.MQTT.Message('Hello mqtt');
                message.destinationName = 'myTopic';
                mqttClient.send(message);
            },
            onFailure: (error) => {
                console.log('connect failed', error);
            }
        });

        setClient(mqttClient);

        // Clean up the effect
        return () => {
            if (mqttClient) {
                mqttClient.disconnect();
            }
        };
    }, []);

    const changePostion = (direction) => {

        let radianAngle, deltaX, deltaY;

        if(joystickValue == 0) {
            deltaX = 0;
            deltaY = direction;
        }
        else {
            radianAngle = joystickValue * Math.PI / 180; 
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
                        name="arrow-up-outline" size={40} color="grey" 
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changePostion(-1)}>
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