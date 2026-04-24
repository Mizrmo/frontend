import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const initMessages = [
  { id: 1, text: 'Good Evening!', time: '8:29 pm', sender: 'driver' },
  { id: 2, text: 'Welcome to mizrmo Customer Service', time: '8:29 pm', sender: 'driver' },
  { id: 3, text: 'Welcome to mizrmo Customer Service', time: '8:29 pm', sender: 'user' },
  { id: 4, text: 'Welcome to mizrmo Customer Service', time: '8:29 pm', sender: 'driver' },
  { id: 5, text: 'Welcome to mizrmo Customer Service', time: 'Just now', sender: 'user' },
];

export default function ChatScreen() {
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
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Messages */}
      <ScrollView
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.msgRow, msg.sender === 'user' ? styles.msgRowUser : styles.msgRowDriver]}>
            {msg.sender === 'driver' && (
              <Image source={require('../../assets/Ellipse 1192.png')} style={styles.chatAvatar} />
            )}
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={styles.footer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your message"
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
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
             <Ionicons name="send" size={24} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F2F2F2',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  
  msgList: { paddingHorizontal: 16, paddingVertical: 20, gap: 20 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgRowDriver: { justifyContent: 'flex-start' },
  chatAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9' },
  
  bubbleContainer: { maxWidth: '75%' },
  bubble: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 4 },
  bubbleDriver: { backgroundColor: '#F3F4F6', borderTopLeftRadius: 4 },
  bubbleUser: { backgroundColor: '#E0EEFF', borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular', lineHeight: 21 },
  bubbleTextUser: { color: '#0052B4' },
  timestamp: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  
  footer: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 15,
    backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F2F2F2',
  },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC', borderRadius: 24, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 16, height: 48,
  },
  input: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  inputActions: { flexDirection: 'row', gap: 8 },
  iconAction: { padding: 4 },
  sendBtn: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }
});
