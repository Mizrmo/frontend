import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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

export default function DriverFavoriteRidesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
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

  const filtered = routes.filter(
    (route) =>
      route.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.dropoff.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRoute = (route: FavouriteRoute) => {
    router.push({
      pathname: '/(driver)/advertise-ride',
      params: { pickup: route.pickup, dropoff: route.dropoff },
    });
  };

  const RideCard = ({ item }: { item: FavouriteRoute }) => (
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
      <TouchableOpacity onPress={() => removeFavouriteRoute(user?.id, item.id).then(setRoutes)}>
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

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved routes..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.countLabel}>{filtered.length} Routes</Text>
        {filtered.map((item) => (
          <RideCard key={item.id} item={item} />
        ))}

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No favourite routes yet</Text>
            <Text style={styles.emptySub}>
              Save routes while searching for rides or advertising trips. Each account has its own favourites.
            </Text>
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
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
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 24 },
  emptyText: { fontSize: 16, color: '#64748B', fontFamily: 'Montserrat_500Medium', marginTop: 16 },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
});
