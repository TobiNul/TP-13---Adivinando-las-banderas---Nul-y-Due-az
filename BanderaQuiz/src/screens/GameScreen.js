import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";

import { useGame } from "../context/GameContext";
import Flag from "../components/Flag";
import GuessForm from "../components/GuessForm";
import ScoreBoard from "../components/ScoreBoard";
import Timer from "../components/Timer";
import Leaderboard from "../components/Leaderboard";

export default function GameScreen() {
  const {
    username,
    setUsername,
    loading,
    error,
    countries,
    gameStarted,
    startGame,
    resetScore,
  } = useGame();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando banderas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Text>Comprobá tu conexión e intentá abrir la app nuevamente.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BANDERA QUIZ</Text>
        <Text style={styles.subtitle}>
          ¿Cuántas banderas del mundo conocés?
        </Text>

        {!gameStarted ? (
          <View style={styles.startBox}>
            <Text style={styles.label}>Ingresá tu nombre para jugar</Text>

            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              value={username}
              onChangeText={setUsername}
              maxLength={20}
            />

            <Button
              title="Empezar a jugar"
              onPress={startGame}
              disabled={!username.trim() || countries.length === 0}
            />
          </View>
        ) : (
          <View style={styles.game}>
            <ScoreBoard />
            <Timer />
            <Flag />
            <GuessForm />

            <Button
              title="Volver al inicio"
              onPress={resetScore}
              color="#777"
            />
          </View>
        )}

        <Leaderboard />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#EAF3FF",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 45,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#EAF3FF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#174A7E",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 8,
    marginBottom: 25,
  },
  startBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 17,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    backgroundColor: "white",
    padding: 12,
    marginBottom: 15,
  },
  game: {
    backgroundColor: "#D8E9FF",
    borderRadius: 12,
    padding: 15,
  },
});