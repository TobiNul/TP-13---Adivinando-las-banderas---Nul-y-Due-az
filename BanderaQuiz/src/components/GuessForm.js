import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { useGame } from "../context/GameContext";

export default function GuessForm() {
  const [respuesta, setRespuesta] = useState("");
  const { guess, pedirPista } = useGame();

  function enviarRespuesta() {
    if (respuesta.trim() === "") return;

    guess(respuesta);
    setRespuesta("");
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Escribí el nombre del país"
        value={respuesta}
        onChangeText={setRespuesta}
        autoCapitalize="words"
        onSubmitEditing={enviarRespuesta}
      />

      <View style={styles.button}>
        <Button
          title="Comprobar respuesta"
          onPress={enviarRespuesta}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Pedir pista (-2 segundos)"
          onPress={pedirPista}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginVertical: 5,
  },
});