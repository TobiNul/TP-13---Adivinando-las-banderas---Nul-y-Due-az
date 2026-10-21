import { Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";

export default function Timer() {
  const { secondsLeft } = useGame();

  return (
    <Text style={styles.timer}>
      Tiempo: {secondsLeft} segundos
    </Text>
  );
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
});