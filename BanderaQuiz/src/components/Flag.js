import { View, Text, StyleSheet } from "react-native";
import { SvgUri } from "react-native-svg";
import { useGame } from "../context/GameContext";

export default function Flag() {
  const { currentCountry, hint } = useGame();

  if (!currentCountry) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿De qué país es esta bandera?</Text>

      <View style={styles.flag}>
        <SvgUri
          uri={currentCountry.flag}
          width="100%"
          height="150"
        />
      </View>

      {hint !== "" && (
        <Text style={styles.hint}>Pista: {hint}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  flag: {
    width: "90%",
    height: 160,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    padding: 5,
  },
  hint: {
    marginTop: 15,
    fontSize: 18,
    letterSpacing: 2,
  },
});