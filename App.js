import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  fetch('https://valencia.opendatasoft.com/api/records/1.0/search/?dataset=itinerarios-ciclistas-itineraris-ciclistes&q=')
  .then(response => response.json())
  .then(data => alert(data));


  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
