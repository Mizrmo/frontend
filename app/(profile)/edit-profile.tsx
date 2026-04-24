import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
  Image, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: 'Daniel Asante',
    email: 'daniel.asante@gmail.com',
    phone: '024 123 4567',
    dob: 'Aug 15, 1993',
    bio: 'Software Engineer and occasional driver.',
  });

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const handleSave = () => {
    Alert.alert('Success', 'Profile updated successfully.');
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
            <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

          {/* Avatar Picker */}
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap} onPress={pickPhoto}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                    <Image source={require('../../assets/lady_profile.png')} style={styles.avatar} />
                </View>
              )}
              <View style={styles.cameraFab}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.tapLabel}>Tap to change photo</Text>
          </View>

          {/* Fields */}
          {[
            { label: 'Full Name', key: 'name', placeholder: 'Your name', keyboard: 'default' },
            { label: 'Email Address', key: 'email', placeholder: 'Your email', keyboard: 'email-address' },
            { label: 'Phone Number', key: 'phone', placeholder: 'Your phone', keyboard: 'phone-pad' },
            { label: 'Date of Birth', key: 'dob', placeholder: 'DD / MM / YYYY', keyboard: 'default' },
          ].map(field => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={form[field.key as keyof typeof form]}
                  onChangeText={t => setForm({ ...form, [field.key]: t })}
                  placeholder={field.placeholder}
                  placeholderTextColor="#94A3B8"
                  keyboardType={field.keyboard as any}
                  autoCapitalize="none"
                />
              </View>
            </View>
          ))}

          {/* Bio */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bio <Text style={styles.optional}>(optional)</Text></Text>
            <View style={[styles.inputWrap, styles.bioWrap]}>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={form.bio}
                onChangeText={t => setForm({ ...form, bio: t })}
                placeholder="Tell others a little about yourself"
                placeholderTextColor="#94A3B8"
                multiline
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Update Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 16, paddingBottom: 20,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  doneText: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3', paddingHorizontal: 8 },
  content: { padding: 24, paddingBottom: 50 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarWrap: { position: 'relative', marginBottom: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center',
  },
  cameraFab: {
    position: 'absolute', bottom: 0, right: 0, width: 34, height: 34,
    backgroundColor: '#0056B3', borderRadius: 17,
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF',
  },
  tapLabel: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 8 },
  fieldGroup: { marginBottom: 24 },
  fieldLabel: { fontSize: 12, color: '#94A3B8', fontFamily: 'Montserrat_700Bold', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  optional: { fontFamily: 'Roboto_400Regular', textTransform: 'lowercase' },
  inputWrap: {
    borderWidth: 1, borderColor: '#F1F5F9', borderRadius: 16,
    backgroundColor: '#FFF', paddingHorizontal: 16, justifyContent: 'center', height: 56,
  },
  bioWrap: { height: 'auto', paddingVertical: 15 },
  input: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  saveBtn: {
    backgroundColor: '#0056B3', height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginTop: 20, elevation: 4, shadowColor: '#0056B3', shadowOpacity: 0.3
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
