import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const initMessages = [
  { id: 1, text: 'Hello! Are you at the pickup point?', time: '8:29 pm', sender: 'rider' },
  { id: 2, text: 'Yes, I am by the main gate in Ashaiman.', time: '8:30 pm', sender: 'rider' },
  { id: 3, text: 'Great, I will be there in 2 minutes.', time: '8:31 pm', sender: 'user' },
];

export default function DriverChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(initMessages);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1, text: message.trim(), time: 'Just now', sender: 'user'
    }]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
            <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
            <View>
                <Text style={styles.headerTitle}>Jane Asantewa</Text>
                <Text style={styles.headerStatus}>Online</Text>
            </View>
        </View>
        <TouchableOpacity style={styles.callBtn}>
          <Ionicons name="call" size={22} color="#0056B3" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.msgRow, msg.sender === 'user' ? styles.msgRowUser : styles.msgRowDriver]}>
            <View style={styles.bubbleContainer}>
              <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleDriver]}>
                <Text style={[styles.bubbleText, msg.sender === 'user' && styles.bubbleTextUser]}>{msg.text}</Text>
              </View>
              <Text style={[styles.timestamp, msg.sender === 'user' && { textAlign: 'right' }]}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <View style={styles.footer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#94A3B8"
              value={message}
              onChangeText={setMessage}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.iconAction}>
                <Ionicons name="camera-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconAction}>
                  <Ionicons name="location-outline" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.sendBtn, message.trim() ? styles.sendBtnActive : null]} 
            onPress={sendMessage}
          >
             <Ionicons name="send" size={22} color={message.trim() ? "#FFF" : "#94A3B8"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F2F2F2',
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  headerTitle: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  headerStatus: { fontSize: 12, color: '#10B981', fontFamily: 'Roboto_400Regular' },
  callBtn: { width: 44, height: 44, backgroundColor: '#EEF6FF', borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  
  msgList: { paddingHorizontal: 16, paddingVertical: 20, gap: 16 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 4 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowDriver: { justifyContent: 'flex-start' },
  
  bubbleContainer: { maxWidth: '80%' },
  bubble: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 4 },
  bubbleDriver: { backgroundColor: '#FFF', borderBottomLeftRadius: 4, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05 },
  bubbleUser: { backgroundColor: '#0056B3', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular', lineHeight: 22 },
  bubbleTextUser: { color: '#FFF' },
  timestamp: { fontSize: 10, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2, marginHorizontal: 4 },
  
  footer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F2F2F2',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12
  },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 28, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 16, height: 50,
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  inputActions: { flexDirection: 'row', gap: 8 },
  iconAction: { padding: 4 },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
  sendBtnActive: { backgroundColor: '#0056B3' }
});
