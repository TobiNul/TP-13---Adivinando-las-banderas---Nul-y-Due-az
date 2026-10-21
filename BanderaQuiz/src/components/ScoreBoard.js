import { View, Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";

export default function ScoreBoard() {
  const { score, username } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.player}>Jugador: {username}</Text>
      <Text style={styles.score}>Puntos: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  player: {
    fontSize: 16,
    fontWeight: "bold",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#176B4D",
  },
});