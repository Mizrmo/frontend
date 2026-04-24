import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const notifications = [
  { 
    id: 1, 
    title: 'New Ride Request', 
    body: 'A rider is looking for a ride from Ashaiman to Tema.', 
    time: '2 mins ago', 
    type: 'request',
    unread: true 
  },
  { 
    id: 2, 
    title: 'Payment Received', 
    body: 'GH¢ 45.00 has been credited to your wallet for the last ride.', 
    time: '1 hour ago', 
    type: 'payment',
    unread: false 
  },
  { 
    id: 3, 
    title: 'Profile Verified', 
    body: 'Your driver documents have been successfully verified.', 
    time: 'Yesterday', 
    type: 'system',
    unread: false 
  },
  { 
    id: 4, 
    title: 'Weekend Bonus!', 
    body: 'Complete 10 rides this weekend to earn an extra GH¢ 50.00.', 
    time: '2 days ago', 
    type: 'promo',
    unread: false 
  },
];

export default function DriverNotificationsScreen() {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch(type) {
        case 'request': return { name: 'car-outline', color: '#0056B3', bg: '#EEF6FF' };
        case 'payment': return { name: 'card-outline', color: '#10B981', bg: '#ECFDF5' };
        case 'system': return { name: 'shield-checkmark-outline', color: '#6366F1', bg: '#EEF2FF' };
        default: return { name: 'notifications-outline', color: '#F59E0B', bg: '#FFF7ED' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.map(noti => {
            const icon = getIcon(noti.type);
            return (
                <TouchableOpacity key={noti.id} style={[styles.notiItem, noti.unread && styles.unreadItem]}>
                    <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
                        <Ionicons name={icon.name as any} size={22} color={icon.color} />
                    </View>
                    <View style={styles.notiContent}>
                        <View style={styles.topRow}>
                            <Text style={styles.notiTitle}>{noti.title}</Text>
                            <Text style={styles.notiTime}>{noti.time}</Text>
                        </View>
                        <Text style={styles.notiBody} numberOfLines={2}>{noti.body}</Text>
                    </View>
                    {noti.unread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
            );
        })}
        
        {notifications.length === 0 && (
            <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={60} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptySub}>We'll notify you when something important happens.</Text>
            </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 15,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  clearBtn: { paddingHorizontal: 10 },
  clearText: { fontSize: 13, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  
  scrollContent: { padding: 20 },
  notiItem: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#F1F5F9',
    alignItems: 'center'
  },
  unreadItem: { backgroundColor: '#F8FAFF', borderColor: '#E0EEFF' },
  iconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  notiContent: { flex: 1, marginLeft: 15 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notiTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  notiTime: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  notiBody: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', lineHeight: 18 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0056B3', marginLeft: 10 },

  emptyContainer: { alignItems: 'center', paddingVertical: 100 },
  emptyTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginTop: 20 },
  emptySub: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }
});
