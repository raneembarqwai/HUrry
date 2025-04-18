import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,Keyboard,TouchableWithoutFeedback } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const notification = ({ route, navigation }) => {
    const { role: userRole } = route.params;
    const [message, setMessage] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('STUDENT');
    const [userId, setUserId] = useState('');
    const [notificationsList, setNotificationsList] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URLS = {
        OPERATOR: {
            SEND: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/announcements/create',
        },
        OTHERS: {
            GET: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/announcements/view'
        }
    };

    useEffect(() => {
        const getToken = async () => {
            const authToken = await AsyncStorage.getItem('authToken');
            if (authToken) {
                setToken(authToken);
                if (userRole !== 'OPERATOR') {
                    fetchNotifications(authToken);
                }
            } else {
                Alert.alert('Error', 'No token found');
            }
        };
        getToken();
    }, [userRole]);

    const fetchNotifications = useCallback(async (authToken) => {
        setLoading(true);
        try {
            const response = await fetch(API_URLS.OTHERS.GET, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (response.ok) {
                setNotificationsList(Array.isArray(data) ? data : []);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'An error occurred while fetching notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    const sendNotificationToRole = async () => {
        if (!token) {
            Alert.alert('Error', 'No token available');
            return;
        }
        
        if (!message.trim()) {
            Alert.alert('Error', 'Please enter a message');
            return;
        }

        try {
            const response = await fetch(API_URLS.OPERATOR.SEND, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: selectedRole,
                    message: message
                }),
            });
            
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Notification sent successfully');
                setMessage('');
            } else {
                Alert.alert('Error', data.message || 'Failed to send notification');
            }
        } catch (error) {
            console.error('Send error:', error);
            Alert.alert('Error', 'An error occurred while sending notification');
        }
    };

    const sendNotificationToUser = async () => {
        if (!token) {
            Alert.alert('Error', 'No token available');
            return;
        }
        
        if (!userId) {
            Alert.alert('Error', 'Please enter a user ID');
            return;
        }

        if (!userMessage.trim()) {
            Alert.alert('Error', 'Please enter a message');
            return;
        }

        try {
            const response = await fetch(API_URLS.OPERATOR.SEND, {  
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: selectedRole,
                    message: userMessage,
                    userId: userId
                }),
            });
            
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Notification sent successfully');
                setUserMessage('');
                setUserId('');
            } else {
                Alert.alert('Error', data.message || 'Failed to send notification');
            }
        } catch (error) {
            console.error('Send error:', error);
            Alert.alert('Error', 'An error occurred while sending notification');
        }
    };

    const renderNotificationItem = ({ item }) => {
        return (
            <View style={styles.notificationItem}>
                <Text style={styles.notificationText}>{item.message}</Text>
                <Text style={styles.notificationDetails}>
                    Sent at: {new Date(item.sentAt).toLocaleString()}
                </Text>
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.appName}>HUrry</Text>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Notification", { role: userRole })}>
                        <Icon name="bell-outline" size={25} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile", { role: userRole })} style={{ marginLeft: 15 }}>
                        <Icon name="account-circle-outline" size={25} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.title}>Welcome, {userRole}!</Text>

            {loading && <ActivityIndicator size="large" color="#59B3F8" />}

            {userRole === 'OPERATOR' ? (
                <View style={styles.dashboard}>
                    <Text style={styles.subtitle}>Send to Role:</Text>
                    <View style={styles.roleSelector}>
                        <TouchableOpacity
                            style={[styles.roleButton, selectedRole === 'STUDENT' && styles.selectedRoleButton]}
                            onPress={() => setSelectedRole('STUDENT')}
                        >
                            <Text style={styles.roleButtonText}>Student</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleButton, selectedRole === 'DRIVER' && styles.selectedRoleButton]}
                            onPress={() => setSelectedRole('DRIVER')}
                        >
                            <Text style={styles.roleButtonText}>Driver</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter message"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                    />
                    <Button title="Send Notification" onPress={sendNotificationToRole} color="#4CAF50" />

                    <Text style={styles.subtitle}>Send to User:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter User ID"
                        value={userId}
                        onChangeText={setUserId}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter message"
                        value={userMessage}
                        onChangeText={setUserMessage}
                        multiline
                    />
                    <Button title="Send Notification" onPress={sendNotificationToUser} color="#4CAF50" />
                </View>
            ) : (
                <View style={styles.dashboard}>
                    <Text style={styles.subtitle}>Your Notifications:</Text>
                    <FlatList
                        data={notificationsList}
                        renderItem={renderNotificationItem}
                        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                        ListEmptyComponent={
                            <Text style={styles.noNotifications}>
                                {loading ? 'Loading...' : 'No notifications available'}
                            </Text>
                        }
                    />
                </View>
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity onPress={() => navigation.navigate("Home", { role: userRole })} style={styles.navItem}>
                    <Icon name="home-outline" size={25} color="#59B3F8" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Schedule", { role: userRole })} style={styles.navItem}>
                    <Icon name="calendar-clock" size={25} color="#59B3F8" />
                    <Text style={styles.navText}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Contact")} style={styles.navItem}>
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
        padding: 16,
        paddingTop: 0,
        paddingBottom: 60,
        backgroundColor: '#f8ffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#333',
    },
    dashboard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
        color: '#555',
    },
    notificationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    notificationText: {
        fontSize: 16,
        marginBottom: 5,
    },
    notificationDetails: {
        fontSize: 12,
        color: '#777',
    },
    noNotifications: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#59B3F8',
        padding: 15,
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    iconContainer: {
        flexDirection: 'row',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#59B3F8',
        marginTop: 5,
    },
    roleSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    roleButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    selectedRoleButton: {
        backgroundColor: '#59B3F8',
    },
    roleButtonText: {
        color: '#333',
    },
});

export default notification; 