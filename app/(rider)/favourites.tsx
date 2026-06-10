import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { toApiDate } from '../../src/api/trip-types';
import {
  getFavouriteRoutes,
  removeFavouriteRoute,
  type FavouriteRoute,
} from '../../src/utils/favourites';
import { useAuth } from '../../src/context/AuthContext';

export default function RiderFavouriteRidesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<FavouriteRoute[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadFavourites = useCallback(async () => {
    const data = await getFavouriteRoutes(user?.id);
    setRoutes(data);
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadFavourites();
    }, [loadFavourites])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadFavourites();
    setIsRefreshing(false);
  };

  const handleRemove = async (id: string) => {
    const updated = await removeFavouriteRoute(user?.id, id);
    setRoutes(updated);
  };

  const openRoute = (route: FavouriteRoute) => {
    router.push({
      pathname: '/(rider)/available-rides',
      params: {
        originCity: route.originCity,
        destinationCity: route.destinationCity,
        departureDate: toApiDate(new Date()),
        pickup: route.pickup,
        dropoff: route.dropoff,
        seats: '1',
      },
    });
  };

  const RouteCard = ({ item }: { item: FavouriteRoute }) => (
    <TouchableOpacity style={styles.card} onPress={() => openRoute(item)}>
      <View style={styles.cardIcon}>
        <MaterialCommunityIcons name="routes" size={24} color="#0056B3" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.label}</Text>
        <Text style={styles.cardSub} numberOfLines={1}>
          {item.pickup} → {item.dropoff}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemove(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="heart" size={20} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourites</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.countLabel}>
          {routes.length} {routes.length === 1 ? 'Route' : 'Routes'}
        </Text>
        {routes.map((item) => (
          <RouteCard key={item.id} item={item} />
        ))}

        {routes.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={52} color="#CBD5E1" />
            <Text style={styles.emptyText}>No favourite routes yet</Text>
            <Text style={styles.emptySub}>
              Save a route from search by tapping the heart icon next to your pickup and drop-off.
            </Text>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => router.push('/(rider)/search-location')}
            >
              <Text style={styles.searchBtnText}>Search for a ride</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  countLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#EEF4FF',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 15, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  cardSub: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 3 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 24 },
  emptyText: { fontSize: 16, color: '#64748B', fontFamily: 'Montserrat_500Medium', marginTop: 16 },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  searchBtn: {
    marginTop: 24,
    backgroundColor: '#0056B3',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 24,
  },
  searchBtnText: { color: '#FFF', fontFamily: 'Montserrat_600SemiBold', fontSize: 15 },
});
