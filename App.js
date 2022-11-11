import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MapView, { Geojson, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { kml } from "@tmcw/togeojson";
import { DOMParser } from "xmldom";

export default function App() {
  const [myPlace, setMyPlace] = useState();

  /* fetch('https://valencia.opendatasoft.com/api/records/1.0/search/?dataset=itinerarios-ciclistas-itineraris-ciclistes&q=')
  .then(response => response.json())
  .then(data => alert(data));*/

  const fetchKML = async () => {
    const url =
      "https://gist.githubusercontent.com/aestcar/d60d60a351d0ab99b6d9cef9422b9345/raw/03866dba2022d745661227fcd154d323487d7a90/itinerarios-ciclistas-itineraris-ciclistes.kml";
    const result = await axios
      .get(url)
      .then((res) => res.data)
      .catch((e) => {
        console.log(e);
        return null;
      });

    if (result != null) {
      const theKML = new DOMParser().parseFromString(result);
      const converted = kml(theKML);
      setMyPlace(converted);
    }
  };

  useEffect(() => {
    fetchKML();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {myPlace && (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: 39.466667,
              longitude: -0.375,
              latitudeDelta:0.5,
              longitudeDelta:0.5
            }}
          >
            <Geojson
              geojson={myPlace}
              strokeColor="red"
              fillColor="blue"
              strokeWidth={3}
            ></Geojson>
          </MapView>
        )}
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
