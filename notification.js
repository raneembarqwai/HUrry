import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const notification = ({ route, navigation }) => {
    const { role } = route.params;
    const [notification, setNotification] = useState('');
    const [notificationToUser, setNotificationToUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('STUDENT');
    const [userId, setUserId] = useState('');
    const [notificationsList, setNotificationsList] = useState([]);
    const [token, setToken] = useState('');

    // روابط API
    const API_URLS = {
        OPERATOR: {
            SEND: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/announcements/create',
            GET: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/announcements/create'
        },
        OTHERS: {
            GET: 'https://5659-2a01-9700-8003-b900-6450-244b-d4d0-be5d.ngrok-free.app/announcements/view'
        }
    };

    useEffect(() => {
        const getToken = async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            setToken(userToken);
        };
        getToken();
    }, []);

    const fetchNotifications = async () => {
        try {
            const apiUrl = role === 'OPERATOR' ? API_URLS.OPERATOR.GET : API_URLS.OTHERS.GET;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setNotificationsList(data);
            } else {
                Alert.alert('Error', data.message || 'Failed to fetch notifications');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while fetching notifications');
        }
    };

    const sendNotificationToRole = async () => {
        try {
            const response = await fetch(API_URLS.OPERATOR.SEND, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: notification,
                    target_role: selectedRole,
                    target_type: 'ROLE' // إرسال إلى دور محدد
                }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Notification sent successfully');
                setNotification('');
                fetchNotifications();
            } else {
                Alert.alert('Error', data.message || 'Failed to send notification');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while sending notification');
        }
    };

    const sendNotificationToUser = async () => {
        try {
            const response = await fetch(API_URLS.OPERATOR.SEND, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: notificationToUser,
                    target_user_id: userId,
                    target_type: 'USER' // إرسال إلى مستخدم محدد
                }),
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Notification sent successfully');
                setNotificationToUser('');
                setUserId('');
                fetchNotifications();
            } else {
                Alert.alert('Error', data.message || 'Failed to send notification');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while sending notification');
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

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

            <Text style={styles.title}>Welcome, {role}!</Text>

            {role === 'OPERATOR' && (
                <View style={styles.dashboard}>
                    {/* Option 1: Send to Role */}
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
                        value={notification}
                        onChangeText={setNotification}
                    />
                    <View style={styles.button}>
                        <Button title="Send Notification" onPress={sendNotificationToRole} color="#4CAF50" />
                    </View>

                    {/* Option 2: Send to Specific User */}
                    <Text style={styles.subtitle}>Send to Specific User:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter User ID"
                        value={userId}
                        onChangeText={setUserId}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter message"
                        value={notificationToUser}
                        onChangeText={setNotificationToUser}
                    />
                    <View style={styles.button}>
                        <Button title="Send Notification" onPress={sendNotificationToUser} color="#4CAF50" />
                    </View>
                </View>
            )}

            {(role === 'STUDENT' || role === 'DRIVER') && (
                <View style={styles.dashboard}>
                    <Text style={styles.subtitle}>Your Notifications:</Text>
                    <FlatList
                        data={notificationsList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.notificationItem}>
                                <Text style={styles.notificationText}>{item.message}</Text>
                                <Text style={styles.notificationDetails}>Sent on: {new Date(item.created_at).toLocaleString()}</Text>
                            </View>
                        )}
                    />
                </View>
            )}

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
        padding: 16,
        paddingTop: 0,
        paddingBottom: 60,
        
        backgroundColor: '#f8ffff',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        top: 10,
    left: 0,
    right: 0,
    },
    dashboard: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 16,
        borderRadius: 4,
        backgroundColor: '#FFF',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 16,
        marginBottom: 8,
        color: '#555',
        fontWeight: '600',
    },
    notificationText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    notificationDetails: {
        fontSize: 12,
        color: '#777',
    },
    notificationItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 4,
    },
    button: {
        marginBottom: 16,
        borderRadius: 4,
        overflow: 'hidden',
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
    roleSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    roleButton: {
        padding: 10,
        borderRadius: 4,
        backgroundColor: '#E0E0E0',
    },
    selectedRoleButton: {
        backgroundColor: '#59B3F8',
    },
    roleButtonText: {
        color: '#333',
    },
});

export default notification;