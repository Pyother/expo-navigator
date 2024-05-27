// * React, Redux and React Native imports:
import { StyleSheet, Text, Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store/store';

// * Own components
import { Header } from './components/Header.jsx';
import { Controller } from './components/Controller.jsx';
import { Footer } from './components/Footer.jsx';
import { Map } from './components/Map.jsx';

// * Gesture controller:
import { GestureHandlerRootView } from "react-native-gesture-handler";
 
export default function App() {

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
          <Header />
          <Map />
          <Controller />
          <Footer />
          <StatusBar style="auto" />
      </GestureHandlerRootView> 
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'android' ? 0 : 20,
  },
});

