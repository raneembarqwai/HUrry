import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  StyleSheet,
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const feedback = ({ route, navigation }) => {
  const { role } = route.params;
  const [formData, setFormData] = useState({
    busStationName: '',
    busNumber: '',
    content: ''
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  
  const API_URLS = {
    STUDENT: 'https://2fbd-2a01-9700-80db-d300-10c1-b5b3-7169-c9e6.ngrok-free.app/comments/submit',
    OPERATOR: 'https://2fbd-2a01-9700-80db-d300-10c1-b5b3-7169-c9e6.ngrok-free.app/comments/page'
  };

  useEffect(() => {
    const getTokenAndData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        if (authToken) {
          setToken(authToken);
          if (role === 'OPERATOR') {
            await fetchFeedbacks(authToken);
          }
        }
      } catch (error) {
        console.error('Token error:', error);
        Alert.alert('Error', 'Failed to load authentication token');
      }
    };
    getTokenAndData();
  }, [role]);

  const handleSubmit = async () => {
    if (!formData.busStationName || !formData.content) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URLS.STUDENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: formData.content,
          busStationName: formData.busStationName,
          busNumber: formData.busNumber || '0'
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Invalid response from server');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      Alert.alert('Success', 'Feedback submitted successfully!');
      setFormData({ busStationName: '', busNumber: '', content: '' });
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (authToken) => {
    try {
      setLoading(true);
      const response = await fetch(API_URLS.OPERATOR, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Raw response:', text);
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch feedbacks');
      }

      const formattedFeedbacks = Array.isArray(data) ? data.map(item => ({
        content: item.content || '',
        studentName: item.studentName || 'Unknown',
        studentEmail: item.studentEmail || 'N/A',
        busStationName: item.busStationName || '',
        busNumber: item.bus || '0',
        sendAt: item.date || new Date().toISOString()
      })) : [];

      setFeedbacks(formattedFeedbacks);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', error.message || 'Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <Icon name="account-circle" size={20} color="#59B3F8" />
        <Text style={styles.feedbackNumber}>{index + 1}</Text>
        <Text style={styles.feedbackTitle}>FEEDBACK</Text>
      </View>
      <Text style={styles.feedbackContent}>{item.content}</Text>
      <View style={styles.feedbackDetails}>
        <Text style={styles.detailText}>
          <Icon name="account" size={14} color="#666" /> {item.studentName}
        </Text>
        <Text style={styles.detailText}>
          <Icon name="email" size={14} color="#666" /> {item.studentEmail}
        </Text>
        <Text style={styles.detailText}>
          <Icon name="bus-stop" size={14} color="#666" /> {item.busStationName}
        </Text>
        <Text style={styles.detailText}>
          <Icon name="bus" size={14} color="#666" /> Bus: {item.busNumber}
        </Text>
      </View>
      <Text style={styles.feedbackDate}>
        <Icon name="clock-outline" size={14} color="#999" /> 
        {item.sendAt ? new Date(item.sendAt).toLocaleString() : 'Unknown date'}
      </Text>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {role === 'STUDENT' ? 'Submit Feedback' : 'Feedback List'}
          </Text>
        </View>

        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#59B3F8" />
          </View>
        )}

        {role === 'STUDENT' ? (
          <ScrollView style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bus Station Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter station name..."
                value={formData.busStationName}
                onChangeText={(text) => setFormData({...formData, busStationName: text})}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bus Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional"
                value={formData.busNumber}
                onChangeText={(text) => setFormData({...formData, busNumber: text})}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your Feedback</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                placeholder="Write your feedback here..."
                value={formData.content}
                onChangeText={(text) => setFormData({...formData, content: text})}
                multiline
                numberOfLines={4}
              />
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Submit Feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <FlatList
            data={feedbacks}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {loading ? 'Loading...' : 'No feedbacks found'}
              </Text>
            }
          />
        )}

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => navigation.navigate("operator", { role })} style={styles.navItem}>
            <Icon name="home-outline" size={25} color="#59B3F8" />
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(role === "OPERATOR" ? 'updateschedule' : 'busSchedule')} style={styles.navItem}>
            <Icon name="calendar-clock" size={25} color="#59B3F8" />
            <Text style={styles.navText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("feedback",{role})} style={styles.navItem}>
            <Icon name="comment-outline" size={25} color="#59B3F8" />
            <Text style={styles.navText}>Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ContactUs",{role})} style={styles.navItem}>
            <Icon name="alert-circle-outline" size={25} color="#59B3F8" />
            <Text style={styles.navText}>Missing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8ffff",
    paddingBottom: 60,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2C3E50',
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 10,
  },
  form: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1, 
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  feedbackItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#59B3F8',
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feedbackNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#59B3F8',
    marginLeft: 8,
    marginRight: 10,
  },
  feedbackTitle: {
    color: '#59B3F8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  feedbackContent: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
    lineHeight: 22,
  },
  feedbackDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#59B3F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
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
    position: 'absolute',
    bottom: 0,
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#59B3F8',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#4a9bd6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContaine: {
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#59B3F8',
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#4a9bd6',
  },
});

export default feedback;