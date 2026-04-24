import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const REWARDS = [
  { id: '1', title: '15% of next ride', cost: '150 Miz Miles' },
  { id: '2', title: '15% of next ride', cost: '150 Miz Miles' },
  { id: '3', title: '15% of next ride', cost: '150 Miz Miles' },
];

export default function MizMilesRewardsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#555" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Miz Miles</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Points Card */}
        <View style={styles.pointsCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.pointsLabel}>Your MizMiles Balance</Text>
            <MaterialCommunityIcons name="seal" size={32} color="#FFCC00" />
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardBody}>
            <Text style={styles.pointsValue}>25,500 pts</Text>
            <TouchableOpacity style={styles.redeemMainBtn}>
              <Text style={styles.redeemMainBtnText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {REWARDS.map(reward => (
          <View key={reward.id} style={styles.rewardCard}>
            <View style={styles.rewardIconBg}>
              <MaterialCommunityIcons name="seal" size={24} color="#FFF" />
            </View>
            <View style={styles.rewardInfo}>
              <View style={styles.rewardTopRow}>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
              <View style={styles.rewardBottomRow}>
                <Text style={styles.rewardCost}>{reward.cost}</Text>
                <TouchableOpacity>
                  <Text style={styles.redeemLink}>Redeem</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4, fontFamily: 'Roboto_400Regular' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_500Medium', color: '#1A1A1A' },
  
  scrollContent: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  
  pointsCard: {
    backgroundColor: '#0052B4',
    borderRadius: 12,
    padding: 24,
    marginBottom: 35,
    width: '100%',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  pointsLabel: { color: '#FFF', fontSize: 18, fontFamily: 'Montserrat_500Medium' },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 20 },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsValue: { color: '#FFF', fontSize: 36, fontFamily: 'Montserrat_500Medium' },
  redeemMainBtn: { backgroundColor: '#FFCC00', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 10 },
  redeemMainBtnText: { color: '#0052B4', fontSize: 16, fontWeight: '700', fontFamily: 'Roboto_400Regular' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 16, color: '#A0A0A0', fontFamily: 'Roboto_400Regular' },
  seeAll: { fontSize: 15, color: '#FFCC00', fontFamily: 'Roboto_400Regular' },
  
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF'
  },
  rewardIconBg: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0052B4', justifyContent: 'center', alignItems: 'center' },
  rewardInfo: { flex: 1, marginLeft: 16 },
  rewardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  rewardTitle: { fontSize: 17, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  rewardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rewardCost: { fontSize: 14, color: '#A0A0A0', fontFamily: 'Roboto_400Regular' },
  redeemLink: { color: '#0052B4', fontSize: 15, fontFamily: 'Montserrat_500Medium' }
});
