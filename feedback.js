import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet,TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const feedback = ({ route, navigation }) => {
  // الحصول على الـ role من route.params
  const { role } = route.params;

  // حالات الطالب
  const [busStationName, setStationName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [content, setMessage] = useState('');

  // حالات المشغل
  const [feedbacks, setFeedbacks] = useState([]);

  // دالة لإرسال الفيدباك من الطالب
  const handleStudentSubmit = async () => {
    try {
      const response = await fetch('https://8516-2a01-9700-8003-b900-1106-e24a-d33e-b4fe.ngrok-free.app/comments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_TOKEN`, // إضافة التوكن هنا
        },
        body: JSON.stringify({
          busStationName,
          busNumber,
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Feedback submitted successfully');
        setStationName('');
        setBusNumber('');
        setMessage('');
      } else {
        Alert.alert('Error', data.content || 'Failed to submit feedback');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback');
    }
  };

  // دالة لجلب الفيدباك للمشغل
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('https://8516-2a01-9700-8003-b900-1106-e24a-d33e-b4fe.ngrok-free.app/comments/page', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer YOUR_TOKEN`, // إضافة التوكن هنا
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbacks(data);
      } else {
        console.error('Failed to fetch feedbacks', data.content);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks', error);
    }
  };

  // جلب البيانات عند تحميل الصفحة إذا كان الدور مشغل
  useEffect(() => {
    if (role === 'OPERATOR') {
      fetchFeedbacks();
    }
  }, [role]);

  // واجهة الطالب
  const renderStudentView = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Student Feedback</Text>
      <Text>Station Name:</Text>
      <TextInput
        value={busStationName}
        onChangeText={setStationName}
        placeholder="Enter station name"
        style={styles.input}
      />
      <Text>Bus Number:</Text>
      <TextInput
        value={busNumber}
        onChangeText={setBusNumber}
        placeholder="Enter bus number or '0'"
        style={styles.input}
      />
      <Text>Message:</Text>
      <TextInput
        value={content}
        onChangeText={setMessage}
        placeholder="Enter your feedback"
        multiline
        style={styles.input}
      />
      <Button title="Submit Feedback" onPress={handleStudentSubmit} />
    </View>
  );

  // واجهة المشغل
  const renderOperatorView = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Operator Feedback</Text>
      <FlatList
        data={feedbacks}
        renderItem={({ item }) => (
          <View style={styles.feedbackItem}>
            <Text>Student Name: {item.studentName}</Text>
            <Text>Email: {item.studentEmail}</Text>
            <Text>Station Name: {item.busStationName}</Text>
            <Text>Bus Number: {item.busNumber}</Text>
            <Text>Message: {item.content}</Text>
            <Text>Time: {new Date(item.sendAt).toLocaleString()}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  return (
    <View style={styles.mainContainer}>
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
      {/* عرض الواجهة بناءً على الدور */}
      {role === 'STUDENT' ? renderStudentView() : renderOperatorView()}
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

// الأنماط
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    flex: 1,
    backgroundColor: '#f8ffff',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 60,
  },
  container: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  feedbackItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#59B3F8",
    paddingVertical: 10,
    paddingHorizontal:20,
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
    //marginHorizontal: -20,
    //marginVertical:75,
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
  role:{
    color: "#59B3F8"
  },
});

export default feedback;