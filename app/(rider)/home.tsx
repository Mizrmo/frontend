import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Dimensions, Modal, Image, Platform, ActivityIndicator 
} from 'react-native';
import { MapView, Marker } from '../../components/Map';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { storage } from '../../src/api/storage';

const { width } = Dimensions.get('window');

export default function RiderHomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const rides = [
    { id: 1, title: 'Tema Community One', price: 'GH¢22', car: 'Toyota Vitz', seats: '3 seats', time: '5mins away' },
    { id: 2, title: 'Accra Mall', price: 'GH¢45', car: 'Hyundai Elantra', seats: '4 seats', time: '8mins away' },
  ];

  const menuItems = [
    { id: '1', title: 'Miz Miles', icon: 'pricetag-outline', route: '/(rider)/mizmiles-rewards' },
    { id: '2', title: 'Trips', icon: 'car-sport-outline', route: '/(rider)/trips' },
    { id: '3', title: 'Referral', icon: '/(profile)/edit-profile' },
    { id: '4', title: 'Payment', icon: 'wallet-outline', route: '/(profile)/payment' },
    { id: '5', title: 'Support', icon: 'headset-outline', route: '/(profile)/help-support' },
    { id: '6', title: 'About Us', icon: 'information-circle-outline', route: '/(profile)/settings' },
  ];

  const navigateTo = (route: string) => {
    setMenuVisible(false);
    router.push(route as any);
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    setLoadingText('Logging out...');
    setLoading(true);
    try {
        await storage.removeItem('token');
        setTimeout(() => {
            setLoading(false);
            router.replace('/(auth)/signin');
        }, 1500);
    } catch (e) {
        setLoading(false);
    }
  };

  const handleSwitchProfile = () => {
    setMenuVisible(false);
    setLoadingText('Switching roles...');
    setLoading(true);
    
    setTimeout(() => {
        setLoading(false);
        setShowSuccessModal(true);
        setTimeout(() => {
            setShowSuccessModal(false);
            router.replace('/(driver)/home');
        }, 2000);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Side Menu Modal */}
      <Modal visible={menuVisible} transparent animationType="none">
        <View style={styles.menuOverlay}>
            <TouchableOpacity 
                style={styles.menuBackdrop} 
                activeOpacity={1} 
                onPress={() => setMenuVisible(false)} 
            />
            <View style={styles.menuPanel}>
                <View style={styles.menuHeader}>
                    <TouchableOpacity onPress={() => setMenuVisible(false)}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Daniel Asante</Text>
                        <TouchableOpacity onPress={() => navigateTo('/(profile)/edit-profile')}>
                            <Text style={styles.profileLink}>Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Switch Profile pill */}
                <TouchableOpacity style={styles.switchPill} onPress={() => handleSwitchProfile()}>
                    <View style={styles.yellowCircle}>
                        <Ionicons name="chevron-down" size={14} color="#FFF" />
                    </View>
                    <Text style={styles.switchText}>Switch to Driver</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                {/* Nav Links */}
                <ScrollView style={styles.menuLinks} showsVerticalScrollIndicator={false}>
                    {menuItems.map(item => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.menuItem} 
                            onPress={() => navigateTo(item.route)}
                        >
                            <Ionicons name={item.icon as any} size={22} color="#1A1A1A" />
                            <Text style={styles.menuItemText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => handleLogout()}>
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* Global Loading Overlay */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#0056B3" />
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.successBox}>
            <View style={styles.successIconBg}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Role Switched!</Text>
            <Text style={styles.successSub}>You are now in Driver mode.</Text>
          </View>
        </View>
      </Modal>

      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: 5.6037,
          longitude: -0.1870,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: 5.6037, longitude: -0.1870 }}>
           <View style={styles.markerCircle}>
              <View style={styles.markerInner} />
           </View>
        </Marker>
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity style={styles.circleBtn} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleBtn} onPress={() => router.push('/(rider)/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(rider)/search-location')}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Book ride</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Available rides</Text>
        <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
          {rides.map(ride => (
            <TouchableOpacity key={ride.id} style={styles.rideCard}>
              <View style={styles.rideIcon}>
                <MaterialCommunityIcons name="car-connected" size={28} color="#0056B3" />
              </View>
              <View style={styles.rideInfo}>
                <View style={styles.rideHeader}>
                   <Text style={styles.rideTitle}>{ride.title}</Text>
                   <Text style={styles.ridePrice}>{ride.price}</Text>
                </View>
                <Text style={styles.rideDetails}>{ride.car} • {ride.seats}</Text>
                <View style={styles.timeRow}>
                   <Ionicons name="time-outline" size={14} color="#666" />
                   <Text style={styles.timeText}>{ride.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  header: { position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  circleBtn: { width: 45, height: 45, backgroundColor: '#FFF', borderRadius: 23, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  notifDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, backgroundColor: '#EA4335', borderRadius: 4, borderWidth: 1, borderColor: '#FFF' },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', height: 350, backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, elevation: 12 },
  dragHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  searchBar: { height: 54, backgroundColor: '#F8FAFC', borderRadius: 27, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 25, borderWidth: 1, borderColor: '#F1F5F9' },
  searchText: { marginLeft: 12, color: '#94A3B8', fontSize: 16, fontFamily: 'Roboto_400Regular' },
  sectionTitle: { fontSize: 16, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 16 },
  rideCard: { flexDirection: 'row', width: '100%', height: 110, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', padding: 20, marginBottom: 13, elevation: 1 },
  rideIcon: { width: 48, height: 48, backgroundColor: '#EEF6FF', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  rideInfo: { flex: 1, marginLeft: 15 },
  rideHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  rideTitle: { fontFamily: 'Montserrat_600SemiBold', fontSize: 16, color: '#1A1A1A' },
  ridePrice: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#0056B3' },
  rideDetails: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#64748B' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  timeText: { fontSize: 12, fontFamily: 'Roboto_400Regular', color: '#94A3B8', marginLeft: 4 },
  markerCircle: { width: 40, height: 40, backgroundColor: 'rgba(0, 86, 179, 0.15)', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  markerInner: { width: 14, height: 14, backgroundColor: '#0056B3', borderRadius: 7, borderWidth: 2, borderColor: '#FFF' },
  
  menuOverlay: { flex: 1, flexDirection: 'row' },
  menuBackdrop: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' },
  menuPanel: { width: '82%', height: '100%', backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  menuHeader: { marginBottom: 30 },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#F1F5F9' },
  profileInfo: { marginLeft: 15 },
  userName: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  profileLink: { fontSize: 14, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 2 },
  switchPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 25, alignSelf: 'flex-start', marginBottom: 30, borderWidth: 1, borderColor: '#F1F5F9' },
  yellowCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFCC00', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  switchText: { fontSize: 14, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  menuDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },
  menuLinks: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  menuItemText: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A', marginLeft: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  logoutText: { fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#EF4444', marginLeft: 16 },

  loadingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  loadingBox: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, alignItems: 'center', elevation: 8 },
  loadingText: { marginTop: 15, fontSize: 16, fontFamily: 'Montserrat_600SemiBold', color: '#1A1A1A' },
  
  successBox: { backgroundColor: '#FFF', padding: 40, borderRadius: 32, alignItems: 'center', elevation: 12, width: '80%' },
  successIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A', marginBottom: 10 },
  successSub: { fontSize: 14, fontFamily: 'Roboto_400Regular', color: '#94A3B8', textAlign: 'center' }
});
