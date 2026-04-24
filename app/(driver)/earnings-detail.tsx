import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const earningsHistory = [
  { id: 1, title: 'Ride to Tema', amount: 'GH¢ 45.00', date: 'Oct 17, 2024', time: '10:30 AM', type: 'Credit' },
  { id: 2, title: 'Shared Ride Ashiaman', amount: 'GH¢ 22.00', date: 'Oct 17, 2024', time: '08:15 AM', type: 'Credit' },
  { id: 3, title: 'Wallet Withdrawal', amount: '-GH¢ 100.00', date: 'Oct 16, 2024', time: '04:20 PM', type: 'Debit' },
  { id: 4, title: 'Inter-city Ride', amount: 'GH¢ 120.00', date: 'Oct 16, 2024', time: '11:00 AM', type: 'Credit' },
  { id: 5, title: 'Bonus Reward', amount: 'GH¢ 10.00', date: 'Oct 15, 2024', time: '09:00 PM', type: 'Credit' },
];

export default function DriverEarningsDetails() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earnings & Payments</Text>
        <TouchableOpacity style={styles.helpBtn}>
            <Ionicons name="help-circle-outline" size={22} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Balance Card Section */}
        <View style={styles.balanceContainer}>
            <LinearGradient
                colors={['#0052B4', '#003E88']}
                style={styles.balanceCard}
            >
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={styles.balanceValue}>GH¢ 1,240.00</Text>
                
                <View style={styles.cardStats}>
                    <View style={styles.cardStatItem}>
                        <Text style={styles.cardStatLabel}>This Week</Text>
                        <Text style={styles.cardStatValue}>GH¢ 450.00</Text>
                    </View>
                    <View style={styles.cardVerticalDivider} />
                    <View style={styles.cardStatItem}>
                        <Text style={styles.cardStatLabel}>Active Rides</Text>
                        <Text style={styles.cardStatValue}>12</Text>
                    </View>
                </View>
            </LinearGradient>
            
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.mainActionBtn}>
                    <Text style={styles.mainActionText}>Withdraw Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secActionBtn}>
                    <Ionicons name="settings-outline" size={20} color="#0056B3" />
                </TouchableOpacity>
            </View>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Transaction History</Text>
                <TouchableOpacity>
                    <Text style={styles.filterText}>Recent</Text>
                </TouchableOpacity>
            </View>

            {earningsHistory.map(item => (
                <View key={item.id} style={styles.historyItem}>
                    <View style={[styles.iconBox, item.type === 'Debit' ? styles.iconBoxDebit : styles.iconBoxCredit]}>
                        <MaterialCommunityIcons 
                            name={item.type === 'Debit' ? "arrow-up-right" : "arrow-down-left"} 
                            size={22} 
                            color={item.type === 'Debit' ? "#EF4444" : "#10B981"} 
                        />
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemMeta}>{item.date} • {item.time}</Text>
                    </View>
                    <Text style={[styles.itemAmount, item.type === 'Debit' && styles.debitText]}>
                        {item.amount}
                    </Text>
                </View>
            ))}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
                <Ionicons name="bar-chart-outline" size={20} color="#0056B3" />
                <Text style={styles.summaryTitle}>Monthly Summary</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Earned</Text>
                <Text style={styles.summaryValue}>GH¢ 3,450.00</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Rides</Text>
                <Text style={styles.summaryValue}>124</Text>
            </View>
            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Miz Miles Earned</Text>
                <Text style={styles.summaryValue}>4.2k pts</Text>
            </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 55 : 35, paddingHorizontal: 16, paddingBottom: 15,
    backgroundColor: '#FFF'
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  helpBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { paddingBottom: 40 },
  balanceContainer: { padding: 20 },
  balanceCard: { borderRadius: 24, padding: 25, elevation: 10, shadowColor: '#0052B4', shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  balanceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Roboto_400Regular' },
  balanceValue: { fontSize: 30, color: '#FFF', fontFamily: 'Montserrat_700Bold', marginTop: 5 },
  cardStats: { flexDirection: 'row', marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  cardStatItem: { flex: 1 },
  cardStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Roboto_400Regular' },
  cardStatValue: { fontSize: 16, color: '#FFF', fontFamily: 'Montserrat_600SemiBold', marginTop: 2 },
  cardVerticalDivider: { width: 1, height: '80%', backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 15, alignSelf: 'center' },
  
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  mainActionBtn: { flex: 1, height: 52, backgroundColor: '#0056B3', borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  mainActionText: { color: '#FFF', fontSize: 15, fontFamily: 'Montserrat_600SemiBold' },
  secActionBtn: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: '#0056B3', justifyContent: 'center', alignItems: 'center' },

  historySection: { paddingHorizontal: 20, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  filterText: { fontSize: 13, color: '#0056B3', fontFamily: 'Montserrat_600SemiBold' },
  
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  iconBoxCredit: { backgroundColor: '#ECFDF5' },
  iconBoxDebit: { backgroundColor: '#FEF2F2' },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  itemMeta: { fontSize: 12, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  itemAmount: { fontSize: 15, fontFamily: 'Montserrat_700Bold', color: '#10B981' },
  debitText: { color: '#EF4444' },

  summaryCard: { margin: 20, backgroundColor: '#EEF6FF', borderRadius: 24, padding: 20 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  summaryTitle: { fontSize: 15, fontFamily: 'Montserrat_700Bold', color: '#0056B3' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 13, color: '#64748B', fontFamily: 'Roboto_400Regular' },
  summaryValue: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' }
});
