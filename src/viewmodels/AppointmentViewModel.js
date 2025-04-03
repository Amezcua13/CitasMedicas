
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export const useAppointmentViewModel = () => {
  const [appointments, setAppointments] = useState([]);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    obtenerSaludo();
    cargarCitas();
  }, []);

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const cargarCitas = async () => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "appointments"), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const citas = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAppointments(citas);
  };

  const eliminarCita = async (id) => {
    Alert.alert("Eliminar Cita", "¿Seguro que deseas eliminar esta cita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "appointments", id));
          cargarCitas();
        },
      },
    ]);
  };

  return {
    saludo,
    appointments,
    eliminarCita,
    cargarCitas,
  };
};
