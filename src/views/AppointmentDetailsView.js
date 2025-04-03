import React from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { Text, Card, Avatar, Menu, Divider } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { useAppointmentDetailsViewModel } from "../viewmodels/AppointmentDetailsViewModel";

const AppointmentDetailsView = () => {
  const {
    appointment,
    status,
    menuVisible,
    scaleValue,
    handleUpdateStatus,
    handleCancelAppointment,
    handlePressIn,
    handlePressOut,
    setMenuVisible,
    navigation,
  } = useAppointmentDetailsViewModel();

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <View style={styles.header}>
        <Avatar.Icon size={60} icon="calendar" style={styles.avatar} />
        <Text style={styles.title}>Detalles de la Cita</Text>
      </View>

      <Card style={styles.card}>
        <Card.Title title={`Paciente: ${appointment.patient}`} left={(props) => <Avatar.Icon {...props} icon="account" />} />
        <Card.Content>
          <Text style={styles.detailText}>📅 Fecha: {appointment.date}</Text>
          <Text style={styles.detailText}>⏰ Hora: {appointment.time}</Text>
          <Text style={styles.detailText}>👨‍⚕️ Doctor: {appointment.doctor}</Text>
          <Text style={styles.detailText}>📍 Ubicación: {appointment.location || "No especificada"}</Text>
          <Text style={styles.detailText}>📌 Estado: <Text style={styles.status}>{status}</Text></Text>
        </Card.Content>
      </Card>

      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable
            onPress={() => setMenuVisible(true)}
            onPressIn={() => handlePressIn(scaleValue)}
            onPressOut={() => handlePressOut(scaleValue)}
            style={({ pressed }) => [styles.statusButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
          >
            <Text style={styles.statusButtonText}>Actualizar Estado</Text>
          </Pressable>
        }
      >
        <Menu.Item onPress={() => handleUpdateStatus("Pendiente")} title="Pendiente" />
        <Divider />
        <Menu.Item onPress={() => handleUpdateStatus("Confirmada")} title="Confirmada" />
        <Divider />
        <Menu.Item onPress={() => handleUpdateStatus("Completada")} title="Completada" />
      </Menu>

      <Pressable
        onPress={handleCancelAppointment}
        onPressIn={() => handlePressIn(scaleValue)}
        onPressOut={() => handlePressOut(scaleValue)}
        style={({ pressed }) => [styles.cancelButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
      >
        <Text style={styles.cancelButtonText}>Cancelar Cita</Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.goBack()}
        onPressIn={() => handlePressIn(scaleValue)}
        onPressOut={() => handlePressOut(scaleValue)}
        style={({ pressed }) => [styles.backButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  avatar: { backgroundColor: "#FFA500", marginRight: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFF" },
  card: { backgroundColor: "#FFF", borderRadius: 15, padding: 15, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4 },
  detailText: { fontSize: 16 },
  status: { fontWeight: "bold", color: "#1565C0" },
  statusButton: { backgroundColor: "#1E88E5", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, alignSelf: "center", marginTop: 15 },
  statusButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16, textAlign: "center" },
  cancelButton: { backgroundColor: "#D32F2F", paddingVertical: 12, borderRadius: 30, alignItems: "center", marginTop: 10 },
  cancelButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  backButton: { backgroundColor: "#757575", paddingVertical: 12, borderRadius: 30, alignItems: "center", marginTop: 10 },
  backButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default AppointmentDetailsView;
