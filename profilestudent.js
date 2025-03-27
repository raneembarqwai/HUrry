import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const profilestudent = ({ route, navigation }) => {
  
  const [studentData, setStudentData] = useState({
    fullName: '',
    email: '',
    profilePicture: '', 
  });

  
  useEffect(() => {
   
    const fetchStudentData = async () => {
      const fakeData = {
        fullName: '',
        email: '',
        profilePicture: 'https://via.placeholder.com/150', 
      };
      setStudentData(fakeData);
    };

    fetchStudentData();
  }, []);

  return (
    <View style={styles.container}>
      {/* صورة البروفايل */}
      <View style={styles.profilePictureContainer}>
        <Image
          source={{ uri: studentData.profilePicture }}
          style={styles.profilePicture}
        />
        <TouchableOpacity
          style={styles.editPictureButton}
         // onPress={() => alert('Edit profile picture')}
        >
          <Text style={styles.editPictureText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* معلومات الطالب */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Full Name:</Text>
        <Text style={styles.value}>{studentData.fullName}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{studentData.email}</Text>
      </View>

      {/* أزرار إضافية */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('EditProfileScreen')} 
        >
          <Text style={styles.footerButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FFFA',
    padding: 20,
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
    backgroundColor: '#4A90E2',
    padding: 5,
    borderRadius: 8,
  },
  editPictureText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555555',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default profilestudent;
