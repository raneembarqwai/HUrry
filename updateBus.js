import React, { useState, useEffect } from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const updateBus = ({ route, navigation }) => {
  const { scheduleId, numberOfBuses } = route.params;

  const [busData, setBusData] = useState(
    Array.from({ length: numberOfBuses }, (_, i) => ({
      number_of_bus: i + 1,
      Driver_name: '',
      Arrival_Time: '',
      Departure_Time: '',
      Driver_Email: '',
    }))
  );

  const [savedData, setSavedData] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        //const storedData = await AsyncStorage.getItem('busData');
        if (storedData) {
          setSavedData(JSON.parse(storedData));
        }
      } catch (error) {
        console.log('Error loading saved data:', error);
      }
    };
    
    const loadToken = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (authToken) {
          setToken(authToken);
        }
      } catch (error) {
        console.log('Error loading token:', error);
      }
    };
    
    loadSavedData();
    loadToken();
  }, []);

  const updateBusStatus = (index, field, value) => {
    const updatedData = [...busData];
    updatedData[index][field] = value;
    setBusData(updatedData);
  };

  const saveUpdates = async () => {
    const isAnyFieldEmpty = busData.some(bus => 
      !bus.Driver_name || !bus.Arrival_Time || !bus.Departure_Time || !bus.Driver_Email
    );

    if (isAnyFieldEmpty) {
      Alert.alert('Error', 'Please fill all fields before saving.');
      return;
    }

    try {
      const response = await fetch('https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/buses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(busData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      //await AsyncStorage.setItem('busData', JSON.stringify(busData));
      setSavedData(busData);
      Alert.alert('Success', 'Bus data saved successfully!');
    } catch (error) {
      console.log('Error saving data:', error);
      Alert.alert('Error', 'Failed to save bus data.');
    }
  };

  return (
    <View style={styles.container}>
      {/* top*/}
      <View style={styles.topBar}>
        <Text style={styles.appName}>HUrry</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Icon name="bell-outline" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ marginLeft: 15 }}>
            <Icon name="account-circle-outline" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.header}>Update Bus Information</Text>

      <ScrollView>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCell}>Bus Number</Text>
            <Text style={styles.tableCell}>Driver</Text>
            <Text style={styles.tableCell}>Arrival time</Text>
            <Text style={styles.tableCell}>Departure time</Text>
            <Text style={styles.tableCell}>Driver email</Text>
          </View>
          {busData.map((bus, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{bus.number_of_bus}</Text>
              <TextInput
                style={styles.input}
                value={bus.Driver_name}
                onChangeText={(text) => updateBusStatus(index, 'Driver_name', text)}
                placeholder="Driver Name"
              />
              <TextInput
                style={styles.input}
                value={bus.Arrival_Time}
                onChangeText={(text) => updateBusStatus(index, 'Arrival_Time', text)}
                placeholder="Arrival Time"
              />
              <TextInput
                style={styles.input}
                value={bus.Departure_Time}
                onChangeText={(text) => updateBusStatus(index, 'Departure_Time', text)}
                placeholder="Departure Time"
              />
              <TextInput
                style={styles.input}
                value={bus.Driver_Email}
                onChangeText={(text) => updateBusStatus(index, 'Driver_Email', text)}
                placeholder="Driver Email"
              />
            </View>
          ))}
        </View>

        {/* saving schedule*/}
        {savedData.length > 0 && (
          <View style={styles.table}>
            <Text style={styles.savedHeader}>Saved Bus Information</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.tableCell}>Bus Number</Text>
                <Text style={styles.tableCell}>Driver</Text>
                <Text style={styles.tableCell}>Arrival time</Text>
                <Text style={styles.tableCell}>Departure time</Text>
                <Text style={styles.tableCell}>Driver email</Text>
              </View>
              {savedData.map((bus, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{bus.number_of_bus}</Text>
                  <Text style={styles.tableCell}>{bus.Driver_name}</Text>
                  <Text style={styles.tableCell}>{bus.Arrival_Time}</Text>
                  <Text style={styles.tableCell}>{bus.Departure_Time}</Text>
                  <Text style={styles.tableCell}>{bus.Driver_Email}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={saveUpdates}>
          <Text style={styles.buttonText}>Save Updates</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* bottom*/}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.navItem}>
          <Icon name="home-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("BusSchedule")} style={styles.navItem}>
          <Icon name="calendar-clock" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Feedback")} style={styles.navItem}>
          <Icon name="comment-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ContactUs")} style={styles.navItem}>
          <Icon name="alert-circle-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Missing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8ffff',
    paddingTop: 0,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2C3E50',
    marginTop: 20,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.4,         
    borderColor: '#DDDDDD',  
    borderRadius: 5,        
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#DDDDDD',
    paddingBottom: 10,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#34495E',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
    fontSize: 14,
    color: '#34495E',
  },
  savedHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1A5276',
  },
  saveButton: {
    backgroundColor: '#59B3F8',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#59B3F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: -20,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  iconContainer: {
    flexDirection: "row",
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 58,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginHorizontal: -20,
    marginTop: 'auto', 
    marginVertical: 0, 
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#59B3F8',
    marginTop: 5,
  },
});

export default updateBus;