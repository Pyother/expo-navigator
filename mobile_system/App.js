import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

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
    justifyContent: 'center',
  },
});

