import { useState, useEffect } from "react";
import { auth, db } from "../services/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export const useRegisterViewModel = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saludo, setSaludo] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  }, []);

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const credenciales = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credenciales.user, { displayName: nombre });

      await setDoc(doc(db, "users", credenciales.user.uid), {
        name: nombre,
        email,
        role: "patient", // Por defecto, paciente
      });

      alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      navigation.navigate("Login");
    } catch (error) {
      alert("Error al registrar: " + error.message);
    }
  };

  return {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    saludo,
    handleRegister,
    navigation,
  };
};
