import { useState, useEffect, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import bad_day from "../images/bad_day.gif";
import good_day from "../images/good_day.gif";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function weatherForecast() {
  const [data, setData] = useState();
  const [image, setImage] = useState();

  async function handleData(json) {
    await setData(json);
  }

  const weatherForecast = () => {
    fetch(
      "https://www.el-tiempo.net/api/json/v2/provincias/46/municipios/46250"
    )
      .then((response) => response.json())
      .then((json) => handleData(json))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    weatherForecast();
  }, []);

  // ReCheck if it is a good day every time data changes
  useEffect(() => {
    isAGoodDay();
  }, [data]);

  const isAGoodDay = useCallback(() => {
    if (data == undefined) return;
    // Get variables
    const stateSky = data.stateSky;
    const tempMin = data.temperaturas.min;
    const tempMax = data.temperaturas.max;
    const wind = data.viento;
    const rainProbability = data.lluvia;

    // def metrics
    const validStateSky = ["Despejado", "Nubes altas"].includes(stateSky);
    const validTemp = tempMax < 40 && tempMin > 0;
    const validWind = wind < 40;
    const validRain = rainProbability < 50;
    // big condition
    if (validStateSky && validTemp && validWind && validRain) {
      setImage(good_day);
    } else setImage(bad_day);
  });

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={image}></Image>

      <TouchableOpacity style={styles.button}>
        <Text style={{ fontSize: 20, color: "#ffffff", margin: 4 }}>
          {" "}
          CONTINUAR{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6D56E9",
  },
  image: {
    width: "100%",
    height: "80%",
  },
  button: {
    flex: 1,
    width: 150,
    maxHeight: 40,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#f3257a",
    position: "relative",
    borderRadius: 15,
    top: 30,
  },
});
