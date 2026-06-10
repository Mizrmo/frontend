import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  formatActivityTime,
  getActivityBody,
  getActivityTitle,
  getNotificationActivity,
  markAllNotificationsRead,
  markNotificationRead,
  mapActivityType,
  type ActivityItem,
} from '../src/api/notifications';
import { getApiErrorMessage } from '../src/api/errors';

type NotifType = 'ride' | 'payment' | 'promo' | 'account';

const iconFor = (type: NotifType) => {
  switch (type) {
    case 'ride':
      return { name: 'car', color: '#0056B3', bg: '#EEF4FF' };
    case 'payment':
      return { name: 'card', color: '#10B981', bg: '#F0FDF4' };
    case 'promo':
      return { name: 'gift', color: '#FFCC00', bg: '#FFFBEB' };
    case 'account':
      return { name: 'shield-checkmark', color: '#8B5CF6', bg: '#F5F3FF' };
  }
};

interface NotificationsListProps {
  showBack?: boolean;
}

export function NotificationsList({ showBack = true }: NotificationsListProps) {
  const router = useRouter();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActivity = useCallback(async () => {
    try {
      setError(null);
      const result = await getNotificationActivity();
      setItems(result.data);
      setUnreadCount(result.unreadCount);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setItems([]);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleMarkAllRead = async () => {
    if (isMarkingAll || unreadCount === 0) {
      return;
    }

    setIsMarkingAll(true);
    const previousItems = items;
    const previousUnread = unreadCount;

    setItems((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);

    try {
      await markAllNotificationsRead();
    } catch (err) {
      setItems(previousItems);
      setUnreadCount(previousUnread);
      setError(getApiErrorMessage(err));
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleMarkRead = async (item: ActivityItem) => {
    if (item.read || !item.id) {
      return;
    }

    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, read: true } : entry))
    );
    setUnreadCount((count) => Math.max(0, count - 1));

    try {
      await markNotificationRead(item.id);
    } catch {
      await loadActivity();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead} disabled={isMarkingAll}>
            <Text style={[styles.markAllBtn, isMarkingAll && styles.markAllBtnDisabled]}>
              {isMarkingAll ? 'Updating…' : 'Mark all read'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 80 }} />
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Ionicons name="ellipse" size={8} color="#0056B3" />
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0056B3" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadActivity}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No notifications yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.id ?? `activity-${index}`}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                setIsRefreshing(true);
                loadActivity();
              }}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const notifType = mapActivityType(item.type);
            const icon = iconFor(notifType);
            return (
              <TouchableOpacity
                style={[styles.card, !item.read && styles.cardUnread]}
                onPress={() => handleMarkRead(item)}
              >
                <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
                  <Ionicons name={icon.name as any} size={22} color={icon.color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{getActivityTitle(item)}</Text>
                  <Text style={styles.cardBody} numberOfLines={2}>
                    {getActivityBody(item)}
                  </Text>
                  <Text style={styles.cardTime}>{formatActivityTime(item.createdAt)}</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  markAllBtn: { fontSize: 13, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3' },
  markAllBtnDisabled: { color: '#94A3B8' },
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF6FF',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },
  unreadText: { fontSize: 13, color: '#0056B3', fontFamily: 'Roboto_400Regular' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 12, fontFamily: 'Roboto_400Regular' },
  retryText: { color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  emptyText: { color: '#94A3B8', fontFamily: 'Roboto_400Regular' },
  list: { padding: 16, paddingBottom: 40 },
  separator: { height: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardUnread: { borderColor: '#BFDBFE', backgroundColor: '#F8FAFF' },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginBottom: 4 },
  cardBody: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular', lineHeight: 18 },
  cardTime: { fontSize: 11, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 6 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0056B3', marginTop: 6 },
});
