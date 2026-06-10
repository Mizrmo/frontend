import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { resolvePostAuthRoute } from '../src/utils/postAuthRoute';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { id: '1', title: 'Share Rides, Save Money!', text: "Cut down on commuting costs by carpooling with people headed your way.", image: require('../assets/welcome-screen.png') },
  { id: '2', title: 'Reduce Emissions', text: 'Every shared ride means fewer cars on the road and cleaner air.', image: require('../assets/welcome-screen.png') },
  { id: '3', title: 'Welcome To Mizrmo', text: 'We are a community built on respect and shared experiences.', image: require('../assets/welcome-screen.png'), last: true }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }
    resolvePostAuthRoute(user).then((route) => {
      router.replace(route);
    });
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0056B3" />
      </View>
    );
  }

  if (showSplash) {
    return (
      <TouchableOpacity 
        style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#0056B3' }]}
        activeOpacity={0.9}
        onPress={() => setShowSplash(false)}
      >
        <Image source={require('../assets/onboarding1.png')} style={{ width: width, height: height, position: 'absolute' }} resizeMode="contain" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.onboardingImg} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.text}</Text>
            </View>
            
            {item.last ? (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.mainBtn} onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.mainBtnText}>Create An Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secBtn} onPress={() => router.push('/(auth)/signin')}>
                  <Text style={styles.secBtnText}>Login</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
      />
      <View style={styles.pagination}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, currentIndex === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  slide: { width, height, alignItems: 'center', padding: 40, justifyContent: 'center' },
  onboardingImg: { width: width * 0.8, height: height * 0.35, marginBottom: 20 },
  textContainer: { alignItems: 'center' },
  title: { fontSize: 26, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 15 },
  description: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24, fontFamily: 'Inter_400Regular' },
  pagination: { flexDirection: 'row', position: 'absolute', bottom: 150, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EEE', marginHorizontal: 5 },
  activeDot: { backgroundColor: '#0056B3', width: 24 },
  footer: { position: 'absolute', bottom: 35, width: '100%', paddingHorizontal: 40 },
  mainBtn: { backgroundColor: '#0056B3', height: 45, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  mainBtnText: { color: '#FFF', fontFamily: 'Roboto_400Regular', fontSize: 16 },
  secBtn: { height: 45, borderRadius: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#DDDDDD' },
  secBtnText: { color: '#414141', fontFamily: 'Roboto_400Regular', fontSize: 16 },
  skipBtn: { position: 'absolute', top: 60, right: 30 },
  skipText: { fontSize: 16, color: '#666' }
});
