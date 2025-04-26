import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator, 
  Alert,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const evaluation = ({ route, navigation }) => {
    const { role } = route.params;
    const [authToken, setAuthToken] = useState('');
    
   
    const STUDENT_API_URL = '/questions/submit';
    const OPERATOR_API_URL = '/questions/page';
    
    // State for questions and answers
    const [questions] = useState([
        "How would you rate the overall experience?",
        "Was the driver’s driving safe and comfortable?",
        "How punctual was the trip (departure and arrival times)?",
        "How would you rate the cleanliness of the bus?",
        "Would you recommend this trip to a friend?"
        
        
    ]);
    
    const [answerOptions] = useState([
        ["Excellent", "Good", "Average", "Poor"],
        ["Yes, very safe", "It was acceptable", "No, I felt uncomfortable"],
        ["Very Punctual", "Slightly late", "Very Late"],
        ["Very Clean", "Acceptable", "Dirty"],
        ["Yes","Maybe","No"]
    ]);
    
    const [answers, setAnswers] = useState(Array(questions.length).fill(''));
    const [busStationName, setStationName] = useState('');
    const [busNumber, setBusNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [evaluations, setEvaluations] = useState([]);
    const [showQuestions, setShowQuestions] = useState(false);
    
    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                setAuthToken(token);
                if (role === 'OPERATOR') {
                    fetchEvaluations(token);
                }
            }
        };
        getToken();
    }, [role]);

    // Fetch evaluations for operator
    const fetchEvaluations = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(OPERATOR_API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setEvaluations(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch evaluations');
            console.error('Fetch evaluations error:', error);
            setEvaluations([]);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };
    
    const handleSubmitStationAndBus = () => {
        if (!busStationName || !busNumber) {
            Alert.alert('Error', 'Please enter station name and bus number');
            return;
        }
        setShowQuestions(true);
    };
    
    const handleSubmitEvaluation = async () => {
        if (answers.some(a => !a)) {
            Alert.alert('Error', 'Please answer all questions');
            return;
        }
        
        setLoading(true);
        
        const evaluationData = {
            busStationName,
            busNumber,
            answers,
            sentAt: new Date().toISOString()
        };
        
        try {
            await axios.post(STUDENT_API_URL, evaluationData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            Alert.alert('Success', 'Evaluation submitted successfully!');
            // Reset form
            setAnswers(Array(questions.length).fill(''));
            setStationName('');
            setBusNumber('');
            setShowQuestions(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit evaluation');
            console.error('Submit evaluation error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const renderStudentView = () => (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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

            <Text style={styles.header}>Trip Evaluation</Text>
            
            {!showQuestions ? (
                <>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Station Name</Text>
                        <TextInput
                            style={styles.input}
                            value={busStationName}
                            onChangeText={setStationName}
                            placeholder="Enter station name"
                        />
                    </View>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bus Number</Text>
                        <TextInput
                            style={styles.input}
                            value={busNumber}
                            onChangeText={setBusNumber}
                            placeholder="Enter bus number"
                        />
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.nextButton} 
                        onPress={handleSubmitStationAndBus}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>Next</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}><Icon name="bus-marker" size={20} color="#59B3F8" /> Station Name:</Text>
                        <Text style={styles.infoValue}>      {busStationName}</Text>
                    </View>
                    
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoLabel}><Icon name="bus" size={20} color="#59B3F8" /> Bus Number:</Text>
                        <Text style={styles.infoValue}>     {busNumber}</Text>
                    </View>
                    
                    {questions.map((question, index) => (
                        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}><Icon name="comment-question" size={20} color="#59B3F8" /> {question}</Text>
                            <Picker
                                selectedValue={answers[index]}
                                onValueChange={(itemValue) => handleAnswerChange(index, itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#59B3F8"
                            >
                                <Picker.Item  label="Select an option" value="" />
                                {answerOptions[index].map((option, optIndex) => (
                                    <Picker.Item key={optIndex} label={option} value={option} />
                                ))}
                            </Picker>
                        </View>
                    ))}
                    
                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmitEvaluation}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Evaluation</Text>
                        )}
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
    
    const renderEvaluationItem = ({ item, index }) => (
        <View style={styles.feedbackItem}>
            <View style={styles.feedbackHeader}>
                <Icon name="account-circle" size={20} color="#59B3F8" />
                <Text style={styles.feedbackNumber}>{index + 1}</Text>
                <Text style={styles.feedbackTitle}>EVALUATION</Text>
            </View>
            
            <View style={styles.feedbackDetails}>
                <Text style={styles.detailText}>
                    <Icon name="account" size={14} color="#666" /> {item.studentName || 'N/A'}
                </Text>
                <Text style={styles.detailText}>
                    <Icon name="email" size={14} color="#666" /> {item.studentEmail || 'N/A'}
                </Text>
                <Text style={styles.detailText}>
                    <Icon name="bus-stop" size={14} color="#666" /> {item.busStationName || 'N/A'}
                </Text>
                <Text style={styles.detailText}>
                    <Icon name="bus" size={14} color="#666" /> Bus: {item.busNumber || 'N/A'}
                </Text>
            </View>
            
            <Text style={[styles.sectionTitle, {marginTop: 10}]}>Evaluation Answers</Text>
            
            {item.answers && item.answers.map((answer, ansIndex) => (
                <View key={ansIndex} style={styles.answerCard}>
                    <Text style={styles.questionText}>{questions[ansIndex]}</Text>
                    <Text style={styles.answerText}>{answer || 'No answer'}</Text>
                </View>
            ))}
            
            <Text style={styles.feedbackDate}>
                <Icon name="clock-outline" size={14} color="#999" /> 
                {item.sentAt ? new Date(item.sentAt).toLocaleString() : 'Unknown date'}
            </Text>
        </View>
    );

    const renderOperatorView = () => (
        <View style={styles.container}>
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

            <Text style={styles.header}>Student Evaluations</Text>
            
            {loading && evaluations.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#59B3F8" />
                </View>
            ) : (
                <FlatList
                    data={evaluations}
                    renderItem={renderEvaluationItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            {loading ? 'Loading...' : 'No evaluations found'}
                        </Text>
                    }
                />
            )}
        </View>
    );
    
    return (
        <View style={styles.mainContainer}>
            {role === 'STUDENT' ? renderStudentView() : renderOperatorView()}
            
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
                <TouchableOpacity onPress={() => navigation.navigate("evaluation", {role})} style={styles.navItem}>
                    <Icon name="comment-outline" size={25} color="#59B3F8" />
                    <Text style={styles.navText}>Evaluation</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ContactUs", {role})} style={styles.navItem}>
                    <Icon name="alert-circle-outline" size={25} color="#59B3F8" />
                    <Text style={styles.navText}>Missing</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#f8ffff",
        paddingBottom: 60,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 60,
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
    header: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        color: '#2C3E50',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#59B3F8',
        marginBottom: 10,
    },
    inputGroup: {
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 1,
    },
    infoContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        margin: 15,
        borderColor:'#E0E0E0',
        marginBottom:-5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        borderWidth: 2, 
        //borderColor: '#ddd',
    },
    infoLabel: {
        fontSize: 16,
        color: '#000',
        fontWeight: '600',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        color: '#4A4A4A',
    },
    questionContainer: {
        marginBottom: 10,
        marginTop:15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        elevation: 2,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        borderWidth: 0.5,
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4A4A4A',
        marginBottom: 10,
    },
    picker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        height: 170, 
        marginVertical: 5, 
        justifyContent: 'center', 
    },
    nextButton: {
        backgroundColor: '#59B3F8',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        margin: 20,
        elevation: 3,
        //alignSelf:'center',
    },
    submitButton: {
        backgroundColor: '#59B3F8',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        margin: 20,
        elevation: 3,
    },
    refreshButton: {
        backgroundColor: '#4A4A4A',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        elevation: 3,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedbackItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        margin: 15,
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
    answerCard: {
        backgroundColor: '#F5F7FF',
        borderRadius: 8,
        padding: 12,
        marginVertical: 5,
        elevation: 1,
    },
    answerText: {
        fontSize: 16,
        color: '#59B3F8',
        fontWeight: '500',
        marginTop: 5,
    },
    feedbackDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        textAlign: 'right',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 60,
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
    questionLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
      },
      questionText: {
        marginLeft: 8,
        color: '#59B3F8', 
        fontSize: 17,
        fontWeight:'600',
      },
});

export default evaluation;