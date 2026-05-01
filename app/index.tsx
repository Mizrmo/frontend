import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  { id: '1', title: 'Share Rides, Save Money!', text: "Cut down on commuting costs by carpooling with people headed your way.", image: require('../assets/welcome-screen.png') },
  { id: '2', title: 'Reduce Emissions', text: 'Every shared ride means fewer cars on the road and cleaner air.', image: require('../assets/welcome-screen.png') },
  { id: '3', title: 'Welcome To Mizrmo', text: 'We are a community built on respect and shared experiences.', image: require('../assets/welcome-screen.png'), last: true }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

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
            ) : (
                <TouchableOpacity style={styles.skipBtn} onPress={() => setCurrentIndex(2)}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}
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
