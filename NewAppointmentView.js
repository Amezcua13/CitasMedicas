import React, { useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated, ScrollView } from "react-native";
import { Text, Avatar, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { useNewAppointmentViewModel } from "../viewmodels/NewAppointmentViewModel";

const NewAppointmentView = () => {
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const {
    date,
    setDate,
    time,
    setTime,
    doctor,
    setDoctor,
    doctorsList,
    status,
    saludo,
    availableTimes,
    getAvailableTimes,
    handleScheduleAppointment,
  } = useNewAppointmentViewModel(navigation);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    const formatted = dayjs(selectedDate).format("DD/MM/YY");
    setDate(formatted);
    if (doctor) getAvailableTimes(formatted, doctor);
    hideDatePicker();
  };

  const handleDoctorChange = (value) => {
    setDoctor(value);
    if (date) getAvailableTimes(date, value);
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient colors={["#0D47A1", "#1976D2"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Avatar.Icon size={80} icon="calendar-plus" style={styles.icon} color="#FFF" />
        <Text style={styles.saludo}>{saludo}</Text>
        <Text style={styles.title}>Agendar nueva cita</Text>

        <Text style={styles.label}>Selecciona doctor</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={doctor}
            onValueChange={handleDoctorChange}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un doctor" value="" />
            {doctorsList.map((doc) => (
              <Picker.Item key={doc.value} label={doc.label} value={doc.value} />
            ))}
          </Picker>
        </View>

        <Button
          mode="contained-tonal"
          onPress={showDatePicker}
          style={styles.dateButton}
        >
          {date ? `📅 ${date}` : "Elegir Fecha"}
        </Button>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />

        {doctor && date && (
          <>
            <Text style={styles.label}>Horarios disponibles:</Text>
            <View style={styles.timesGrid}>
              {availableTimes.length > 0 ? (
                availableTimes.map((hora) => (
                  <Pressable
                    key={hora}
                    onPress={() => setTime(hora)}
                    style={[
                      styles.timeCard,
                      time === hora && styles.timeCardSelected,
                    ]}
                  >
                    <Text style={styles.timeText}>{hora}</Text>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.noTimes}>No hay horarios disponibles</Text>
              )}
            </View>
          </>
        )}

        <Pressable
          onPress={handleScheduleAppointment}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            styles.submitButton,
            { transform: [{ scale: pressed ? 0.95 : 1 }] },
          ]}
        >
          <Text style={styles.submitText}>Agendar cita</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    padding: 20,
    alignItems: "center",
  },
  icon: {
    backgroundColor: "#FFA500",
    marginBottom: 10,
  },
  saludo: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    color: "#FFA500",
    marginBottom: 15,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 6,
    marginBottom: 15,
  },
  picker: {
    width: "100%",
  },
  label: {
    color: "#FFF",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  dateButton: {
    width: "100%",
    marginBottom: 15,
  },
  timesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  timeCard: {
    padding: 10,
    margin: 6,
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  timeCardSelected: {
    backgroundColor: "#FFA500",
  },
  timeText: {
    fontWeight: "bold",
    color: "#000",
  },
  noTimes: {
    color: "#FFF",
    fontStyle: "italic",
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  submitText: {
    fontWeight: "bold",
    color: "#1976D2",
    fontSize: 16,
  },
});

export default NewAppointmentView;