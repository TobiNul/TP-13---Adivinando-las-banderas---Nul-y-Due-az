import { View, Text, StyleSheet } from "react-native";
import { useGame } from "../context/GameContext";

export default function Leaderboard() {
  const { leaderboard } = useGame();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking de jugadores</Text>

      {leaderboard.length === 0 ? (
        <Text>Todavía no hay puntajes guardados.</Text>
      ) : (
        leaderboard.slice(0, 5).map((jugador, index) => (
          <View key={jugador.nombre} style={styles.row}>
            <Text>
              {index + 1}. {jugador.nombre}
            </Text>
            <Text>{jugador.puntaje} pts</Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});