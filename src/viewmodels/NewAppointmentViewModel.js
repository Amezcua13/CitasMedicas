// viewmodels/NewAppointmentScreenViewModel.js
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { db, auth } from "../services/firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export const useNewAppointmentViewModel = (navigation) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctorsList, setDoctorsList] = useState([]);
  const [status, setStatus] = useState("pendiente");
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    obtenerSaludo();
    cargarDoctoresDisponibles();
  }, []);

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) setSaludo("🌅 Buenos días,");
    else if (hora >= 12 && hora < 19) setSaludo("🌇 Buenas tardes,");
    else setSaludo("🌙 Buenas noches,");
  };

  const cargarDoctoresDisponibles = async () => {
    try {
      const q = query(collection(db, "users"), where("role", "==", "doctor"));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        label: doc.data().name,
        value: doc.data().name,
      }));
      setDoctorsList(lista);
    } catch (error) {
      console.error("Error cargando doctores:", error);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!date || !time || !doctor) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        userId: auth.currentUser.uid,
        patient: auth.currentUser.displayName || "Paciente",
        date,
        time,
        doctor,
        status,
      });

      Alert.alert("✅ Cita agendada", "Tu cita ha sido registrada correctamente.");
      navigation.navigate("Appointments");
    } catch (error) {
      Alert.alert("Error", "No se pudo agendar la cita.");
    }
  };

  return {
    date,
    time,
    doctor,
    doctorsList,
    status,
    saludo,
    setDate,
    setTime,
    setDoctor,
    setStatus,
    handleScheduleAppointment,
  };
};
