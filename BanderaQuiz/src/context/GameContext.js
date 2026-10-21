import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GameContext = createContext();

const API_URL =
  "https://countriesnow.space/api/v0.1/countries/flag/images";

const TIEMPO_INICIAL = 15;

function mezclarNombre(nombre) {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function GameProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIEMPO_INICIAL);
  const [hint, setHint] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Traemos las banderas de la API cuando se monta el proveedor.
  useEffect(() => {
    async function cargarPaises() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("No se pudo conectar con la API");
        }

        const result = await response.json();

        if (result.error || !Array.isArray(result.data)) {
          throw new Error("La API devolvió datos incorrectos");
        }

        const lista = result.data.filter(
          (pais) => pais.name && pais.flag
        );

        if (lista.length === 0) {
          throw new Error("No se encontraron banderas");
        }

        setCountries(lista);
        setCurrentCountry(
          lista[Math.floor(Math.random() * lista.length)]
        );
      } catch (e) {
        setError("No se pudieron cargar las banderas. Intentá de nuevo.");
      } finally {
        setLoading(false);
      }
    }

    cargarPaises();
  }, []);

  // Recuperamos el ranking guardado en el celular.
  useEffect(() => {
    async function cargarRanking() {
      try {
        const guardado = await AsyncStorage.getItem("ranking");

        if (guardado) {
          setLeaderboard(JSON.parse(guardado));
        }
      } catch (e) {
        console.log("No se pudo cargar el ranking");
      }
    }

    cargarRanking();
  }, []);

  function elegirPais() {
    if (countries.length === 0) return;

    let nuevoPais =
      countries[Math.floor(Math.random() * countries.length)];

    if (countries.length > 1 && currentCountry) {
      while (nuevoPais.name === currentCountry.name) {
        nuevoPais =
          countries[Math.floor(Math.random() * countries.length)];
      }
    }

    setCurrentCountry(nuevoPais);
    setSecondsLeft(TIEMPO_INICIAL);
    setHint("");
  }

  // Actualizamos el puntaje del jugador en el ranking.
  async function guardarPuntaje(nuevoPuntaje) {
    const nombre = username.trim();

    if (!nombre) return;

    const actualizado = [...leaderboard];
    const indice = actualizado.findIndex(
      (jugador) =>
        jugador.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (indice >= 0) {
      actualizado[indice].puntaje = Math.max(
        actualizado[indice].puntaje,
        nuevoPuntaje
      );
    } else {
      actualizado.push({
        nombre,
        puntaje: nuevoPuntaje,
      });
    }

    actualizado.sort((a, b) => b.puntaje - a.puntaje);

    setLeaderboard(actualizado);

    try {
      await AsyncStorage.setItem(
        "ranking",
        JSON.stringify(actualizado)
      );
    } catch (e) {
      console.log("No se pudo guardar el ranking");
    }
  }

  function startGame() {
    if (!username.trim() || !currentCountry) return;

    setScore(0);
    setSecondsLeft(TIEMPO_INICIAL);
    setHint("");
    setGameStarted(true);
  }

  function guess(respuesta) {
    if (!currentCountry || !gameStarted) return;

    if (
      mezclarNombre(respuesta) ===
      mezclarNombre(currentCountry.name)
    ) {
      const nuevoPuntaje = score + 10 + secondsLeft;

      setScore(nuevoPuntaje);
      guardarPuntaje(nuevoPuntaje);
      elegirPais();
    } else {
      const nuevoPuntaje = score - 1;

      setScore(nuevoPuntaje);
      guardarPuntaje(nuevoPuntaje);
    }
  }

  // Pasamos a otra bandera cuando termina el tiempo.
  useEffect(() => {
    if (!gameStarted || secondsLeft > 0) return;

    elegirPais();
  }, [secondsLeft, gameStarted]);

  // El contador baja un segundo cada vez.
  useEffect(() => {
    if (!gameStarted || loading || error) return;

    const intervalo = setInterval(() => {
      setSecondsLeft((anterior) => Math.max(anterior - 1, 0));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [gameStarted, loading, error, currentCountry]);

  function pedirPista() {
    if (!currentCountry || !gameStarted || secondsLeft <= 2) {
      return;
    }

    const nombre = currentCountry.name;
    const letras = [];

    for (let i = 0; i < nombre.length; i++) {
      if (/[a-záéíóúüñ]/i.test(nombre[i])) {
        letras.push(i);
      }
    }

    if (letras.length === 0) return;

    const posicion = letras[Math.floor(Math.random() * letras.length)];

    const textoPista = nombre
      .split("")
      .map((letra, i) => {
        if (i === posicion) return letra;
        if (letra === " ") return " ";
        return "_";
      })
      .join(" ");

    setHint(textoPista);
    setSecondsLeft((anterior) => Math.max(anterior - 2, 0));
  }

  function resetScore() {
    setScore(0);
    setSecondsLeft(TIEMPO_INICIAL);
    setHint("");
    setGameStarted(false);
  }

  return (
    <GameContext.Provider
      value={{
        countries,
        currentCountry,
        score,
        username,
        setUsername,
        gameStarted,
        secondsLeft,
        hint,
        leaderboard,
        loading,
        error,
        startGame,
        guess,
        elegirPais,
        pedirPista,
        resetScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}