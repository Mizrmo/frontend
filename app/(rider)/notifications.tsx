import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Notif = {
  id: string;
  type: 'ride' | 'payment' | 'promo' | 'account';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const NOTIFICATIONS: Notif[] = [
  { id: '1', type: 'ride', title: 'Ride Confirmed', body: 'Your ride to Community One has been confirmed. Daniel is on his way.', time: '2 mins ago', read: false },
  { id: '2', type: 'payment', title: 'Payment Successful', body: 'GH¢22.00 was deducted for your last trip to Community One.', time: '10 mins ago', read: false },
  { id: '3', type: 'promo', title: 'Earn MizMiles!', body: 'Refer a friend and earn 100 bonus MizMiles on your next ride.', time: '1 hr ago', read: true },
  { id: '4', type: 'ride', title: 'Ride Completed', body: 'Your ride to Tema Station has ended. Rate your driver!', time: '3 hrs ago', read: true },
  { id: '5', type: 'account', title: 'Account Verified', body: 'Your Ghana Card has been successfully verified.', time: 'Yesterday', read: true },
  { id: '6', type: 'promo', title: '20% Off This Weekend', body: 'Use code WEEKEND20 to get 20% off any ride this Saturday & Sunday.', time: 'Yesterday', read: true },
];

const iconFor = (type: Notif['type']) => {
  switch (type) {
    case 'ride': return { name: 'car', color: '#0056B3', bg: '#EEF4FF' };
    case 'payment': return { name: 'card', color: '#10B981', bg: '#F0FDF4' };
    case 'promo': return { name: 'gift', color: '#FFCC00', bg: '#FFFBEB' };
    case 'account': return { name: 'shield-checkmark', color: '#8B5CF6', bg: '#F5F3FF' };
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState(NOTIFICATIONS);

  const markAllRead = () => setItems(items.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllBtn}>Mark all read</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="ellipse" size={8} color="#0056B3" />
          <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const icon = iconFor(item.type);
          return (
            <TouchableOpacity
              style={[styles.card, !item.read && styles.cardUnread]}
              onPress={() => setItems(items.map(n => n.id === item.id ? { ...n, read: true } : n))}
            >
              <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
                <Ionicons name={icon.name as any} size={22} color={icon.color} />
              </View>
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.cardBody}>{item.body}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={52} color="#CBD5E1" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySub}>We'll notify you when something comes up</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  markAllBtn: { fontSize: 13, color: '#0056B3', fontFamily: 'Roboto_400Regular' },
  unreadBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EEF4FF', paddingHorizontal: 20, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#DBEAFE',
  },
  unreadText: { fontSize: 13, color: '#0056B3', fontFamily: 'Roboto_400Regular' },
  list: { paddingVertical: 12, paddingHorizontal: 16, paddingBottom: 40 },
  separator: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 2 },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF',
    borderRadius: 16, padding: 16, gap: 14,
  },
  cardUnread: { backgroundColor: '#F8FAFF' },
  iconBox: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardTitle: { fontSize: 14, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A', flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0056B3', marginLeft: 8 },
  cardBody: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', lineHeight: 19, marginBottom: 6 },
  cardTime: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#94A3B8', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#CBD5E1', fontFamily: 'Roboto_400Regular', marginTop: 6 },
});
