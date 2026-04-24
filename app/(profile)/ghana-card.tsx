import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function GhanaCardScreen() {
  const router = useRouter();
  const [images, setImages] = useState<{ photo?: string, idCard?: string }>({});

  const pickImage = async (type: 'photo' | 'idCard') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages({ ...images, [type]: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    Alert.alert("Success", "Card details saved successfully.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
           <Ionicons name="chevron-back" size={24} color="#414141" />
           <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ghana Card</Text>
        <TouchableOpacity><Text style={styles.skipBtn}>Skip</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>ID Card Number</Text>
          <View style={styles.inputWrap}>
            <TextInput style={styles.input} defaultValue="GHA- 000000-4" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Expiry Date</Text>
          <View style={styles.inputWrap}>
             <TextInput style={styles.input} defaultValue="Aug 30, 2030" editable={false} />
             <Ionicons name="calendar-outline" size={20} color="#94A3B8" />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Photo</Text>
          <TouchableOpacity style={styles.imageBox} onPress={() => pickImage('photo')}>
            {images.photo ? (
              <Image source={{ uri: images.photo }} style={styles.previewImg} />
            ) : (
              <Ionicons name="camera" size={32} color="#CBD5E1" />
            )}
            <View style={styles.editFab}>
              <MaterialIcons name="edit" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>ID Card Scan</Text>
          <TouchableOpacity style={styles.imageBox} onPress={() => pickImage('idCard')}>
            {images.idCard ? (
              <Image source={{ uri: images.idCard }} style={styles.previewImg} />
            ) : (
              <Ionicons name="image" size={32} color="#CBD5E1" />
            )}
            <View style={styles.editFab}>
              <MaterialIcons name="edit" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, marginLeft: 4, color: '#414141' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  skipBtn: { color: '#64748B', fontSize: 15 },
  content: { padding: 25 },
  formGroup: { marginBottom: 25 },
  label: { fontSize: 14, color: '#64748B', marginBottom: 8, fontWeight: '500' },
  inputWrap: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', 
    height: 50, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E2E8F0' 
  },
  input: { flex: 1, fontSize: 16, color: '#1A1A1A' },
  imageBox: { 
    height: 180, backgroundColor: '#F8FAFC', borderRadius: 20, 
    justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#CBD5E1' 
  },
  previewImg: { width: '100%', height: '100%', borderRadius: 18 },
  editFab: { 
    position: 'absolute', bottom: -10, right: 10, width: 34, height: 34, 
    backgroundColor: '#0056B3', borderRadius: 17, justifyContent: 'center', alignItems: 'center', elevation: 4 
  },
  saveBtn: { 
    backgroundColor: '#0056B3', height: 56, borderRadius: 28, 
    justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 50 
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
