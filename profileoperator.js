import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileoperator = ({ route, navigation }) => {
  const { role } = route.params;
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    studentId: '',
    licenseNumber: '',
    company_name: '',
    profilePicture: null,
  });

  // روابط API لكل نوع مستخدم
  const API_URLS = {
    STUDENT: {
      GET: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/student/profile',
      PUT: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/student/profile'
    },
    DRIVER: {
      GET: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/driver/profile',
      PUT: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/driver/profile'
    },
    OPERATOR: {
      GET: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/operator/profile',
      PUT: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/operator/profile'
    }
  };

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      // تحديد الرابط بناءً على نوع المستخدم
      const apiUrl = API_URLS[role].GET;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      
      // تحديث البيانات بناءً على نوع المستخدم
      const updatedData = {
        name: data.name || '',
        email: data.email || '',
        profilePicture: data.profilePicture || null,
      };

      if (role === 'STUDENT') {
        updatedData.studentId = data.studentId || '';
      } else if (role === 'DRIVER') {
        updatedData.licenseNumber = data.licenseNumber || '';
      } else if (role === 'OPERATOR') {
        updatedData.company_name = data.company_name || '';
      }
      
      setUserData(updatedData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user data');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEditProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, profilePicture: result.assets[0].uri });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      // تحديد الرابط بناءً على نوع المستخدم
      const apiUrl = API_URLS[role].PUT;

      // تحضير البيانات للإرسال
      const requestData = {
        name: userData.name,
        email: userData.email,
        profilePicture: userData.profilePicture,
      };

      // إضافة الحقول الخاصة بكل نوع مستخدم
      if (role === 'STUDENT') {
        requestData.studentId = userData.studentId;
      } else if (role === 'DRIVER') {
        requestData.licenseNumber = userData.licenseNumber;
      } else if (role === 'OPERATOR') {
        requestData.company_name = userData.company_name;
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      Alert.alert('Success', 'Your changes have been saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes');
      console.error(error);
    }
  };

  // عرض المحتوى بناءً على الدور
  const renderContentBasedOnRole = () => {
    switch (role) {
      case 'STUDENT':
        return (
          <View style={styles.roleSpecificContainer}>
            <Text style={styles.roleSpecificHeader}></Text>
            <Text style={styles.roleSpecificText}>Student Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Enter Student Name"
            />

            <Text style={styles.roleSpecificText}>Student Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter Student Email"
              keyboardType="email-address"
            />

            <Text style={styles.roleSpecificText}>Student ID:</Text>
            <TextInput
              style={styles.input}
              value={userData.studentId}
              onChangeText={(text) => setUserData({ ...userData, studentId: text })}
              placeholder="Enter Student ID"
              keyboardType="numeric"
            />
          </View>
        );
      case 'DRIVER':
        return (
          <View style={styles.roleSpecificContainer}>
            <Text style={styles.roleSpecificHeader}> </Text>
            <Text style={styles.roleSpecificText}>Driver Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Enter Driver Name"
            />

            <Text style={styles.roleSpecificText}>Driver Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter Driver Email"
              keyboardType="email-address"
            />

            <Text style={styles.roleSpecificText}>Driver ID:</Text>
            <TextInput
              style={styles.input}
              value={userData.licenseNumber}
              onChangeText={(text) => setUserData({ ...userData, licenseNumber: text })}
              placeholder="Enter Driver ID"
              keyboardType="numeric"
            />
          </View>
        );
      case 'OPERATOR':
        return (
          <View style={styles.roleSpecificContainer}>
            <Text style={styles.roleSpecificHeader}></Text>
            <Text style={styles.roleSpecificText}>Operator Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.name}
              onChangeText={(text) => setUserData({ ...userData, name: text })}
              placeholder="Enter Operator Name"
            />

            <Text style={styles.roleSpecificText}>Operator Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="Enter Operator Email"
              keyboardType="email-address"
            />

            <Text style={styles.roleSpecificText}>Company Name:</Text>
            <TextInput
              style={styles.input}
              value={userData.company_name}
              onChangeText={(text) => setUserData({ ...userData, company_name: text })}
              placeholder="Enter Company Name"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.appName}>HUrry</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("notification", { role })}>
            <Icon name="bell-outline" size={25} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("profileop", { role })} style={{ marginLeft: 15 }}>
            <Icon name="account-circle-outline" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Picture */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={styles.profilePictureContainer}>
          {userData.profilePicture ? (
            <Image
              source={{ uri: userData.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <Icon name="account-circle" size={120} color="#CCCCCC" />
          )}
          <TouchableOpacity
            style={styles.editPictureButton}
            onPress={handleEditProfilePicture}
          >
            <Text style={styles.editPictureText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Role-specific content */}
        {renderContentBasedOnRole()}

        {/* Save button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.footerButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate("Home", { role })} style={styles.navItem}>
          <Icon name="home-outline" size={25} color="#59B3F8" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(role === "OPERATOR" ? 'updateschedule' : 'busSchedule')} style={styles.navItem}>
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
    backgroundColor: '#f8ffff',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 60, // ارتفاع الشريط السفلي
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DDDDDD',
  },
  editPictureButton: {
    marginTop: 10,
    backgroundColor: '#59B3F8',
    padding: 5,
    borderRadius: 8,
  },
  editPictureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20, // مسافة صغيرة فوق الزر
    alignItems: 'center',
    marginBottom: 20, // مسافة صغيرة تحت الزر
  },
  footerButton: {
    backgroundColor: '#59B3F8',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute', // جعله ثابتًا
    bottom: 0, // وضعه في الأسفل
    left: 0,
    right: 0,
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
  roleSpecificContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F1F8FF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  roleSpecificHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2C3E50',
    textAlign: 'center',
  },
  roleSpecificText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#34495E',
  },
  input: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555555',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 5,
  },
});

export default profileoperator;