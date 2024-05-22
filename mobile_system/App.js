import { StyleSheet, Text, View, Platform, StatusBar } from 'react-native';

// * Own components
import { Header } from './components/Header.jsx';

 
export default function App() {

  return (
    <View style={styles.container}>
        <Header />
        <StatusBar style="auto" />
    </View>
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

