import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Button,
} from "react-native";
import MapView, { Geojson, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { kml } from "@tmcw/togeojson";
import { DOMParser } from "xmldom";

export default function Map({ navigation }) {
  const [myPlace, setMyPlace] = useState();
  let myReservasOn = false;

  const fetchKML = async () => {
    let url;
    if (myReservasOn == false) {
      url =
        "https://gist.githubusercontent.com/aestcar/d60d60a351d0ab99b6d9cef9422b9345/raw/03866dba2022d745661227fcd154d323487d7a90/itinerarios-ciclistas-itineraris-ciclistes.kml";
    } else {
      url =
        "https://gist.githubusercontent.com/aestcar/7314e19dcfb8ea957bd9a94b05af60e2/raw/e49e1c69b735484c57b51b021319abbf1acd131c/rutas%2520en%2520bicicleta%2520por%2520la%2520ciudad%2520de%2520Valencia.kml"; // URL RUTAS
    }
    const result = await axios
      .get(url)
      .then((res) => res.data)
      .catch((e) => {
        return null;
      });

    if (result != null) {
      const theKML = new DOMParser().parseFromString(result);
      const converted = kml(theKML);
      setMyPlace(converted);
    }
  };

  const cambiarAMisReservas = () => {
    if (myReservasOn == true) {
      myReservasOn = false;
    } else {
      myReservasOn = true;
    }
  };

  useEffect(() => {
    fetchKML();
  }, []);

  const [text, onChangeText] = React.useState("");

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {myPlace && (
          <View>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
              placeholder=""
            />
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={{
                latitude: 39.466667,
                longitude: -0.375,
                latitudeDelta: 1,
                longitudeDelta: 1,
              }}
            >
              <Geojson
                geojson={myPlace}
                strokeColor="red"
                fillColor="blue"
                strokeWidth={3}
              ></Geojson>
            </MapView>
          </View>
        )}
      </View>

      <StatusBar style="auto" />

      <View style={styles.consultWeatherView}>
        <Button
          title="Consultar tiempo"
          onPress={() => {
            navigation.navigate("Weather");
          }}
        ></Button>
        <Button
          title="Consultar mis rutas"
          onPress={() => {
            cambiarAMisReservas();
            console.log(myReservasOn);
            fetchKML();
          }}
        ></Button>
      </View>
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
  input: {
    width: Dimensions.get("window").width,
  },
  map: {
    width: Dimensions.get("window").width,
    height: (Dimensions.get("window").height / 5) * 4,
  },
  consultWeatherView: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 5,
    display: "flex",
    flexDirection: "row",
  },
});
