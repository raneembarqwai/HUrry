import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  FlatList, 
  StyleSheet,
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView 
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

  // روابط API
  const API_URLS = {
    STUDENT: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/comments/submit',
    OPERATOR: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/comments/page'
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
          content: formData.content,          // الحقل المطلوب
          busStationName: formData.busStationName, // الحقل المطلوب
          busNumber: formData.busNumber || '0'    // الحقل المطلوب
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

      // تحويل البيانات لتطابق الأسماء المطلوبة
      const formattedFeedbacks = Array.isArray(data) ? data.map(item => ({
        content: item.message || '',
        studentName: item.studentName || 'Unknown',
        student_Email: item.student_Email || 'N/A',
        busStationName: item.station || '',
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.studentInfo}>
        {item.studentName} ({item.student_Email})
      </Text>
      <Text style={styles.stationInfo}>
        Station: {item.busStationName} | Bus: {item.busNumber}
      </Text>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.date}>
        {item.sendAt ? new Date(item.sendAt).toLocaleString() : 'Unknown date'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {role === 'STUDENT' ? 'Submit Feedback' : 'Feedback List'}
        </Text>
      </View>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {role === 'STUDENT' ? (
        <ScrollView style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Bus Station Name*"
            value={formData.busStationName}
            onChangeText={(text) => setFormData({...formData, busStationName: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Bus Number (optional)"
            value={formData.busNumber}
            onChangeText={(text) => setFormData({...formData, busNumber: text})}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Your Feedback*"
            value={formData.content}
            onChangeText={(text) => setFormData({...formData, content: text})}
            multiline
            numberOfLines={4}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={loading}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={feedbacks}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No feedbacks found'}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#59B3F8',
    padding: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
    padding: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  studentInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  stationInfo: {
    color: '#555',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    marginVertical: 10,
  },
  date: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default feedback;