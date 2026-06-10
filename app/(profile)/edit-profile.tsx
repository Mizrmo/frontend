import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, uploadProfilePhoto } from '../../src/api/auth';
import { getApiErrorMessage } from '../../src/api/errors';
import { useAuth } from '../../src/context/AuthContext';
import {
  getRemoteProfilePhotoUrl,
  resolveProfilePhotoUri,
  saveLocalProfilePhoto,
} from '../../src/utils/profilePhoto';
import {
  getRemoteProfileBio,
  resolveProfileBio,
  saveLocalProfileBio,
} from '../../src/utils/profileBio';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [photo, setPhoto] = useState<string | null>(null);
  const [savedPhotoUri, setSavedPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      phone: user.phoneNumber ?? '',
      bio: '',
    });

    resolveProfilePhotoUri(user.id, getRemoteProfilePhotoUrl(user)).then((uri) => {
      setSavedPhotoUri(uri);
      setPhoto(uri);
    });

    resolveProfileBio(user.id, getRemoteProfileBio(user)).then((bio) => {
      setForm((current) => ({ ...current, bio }));
    });
  }, [user]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert('Profile', 'First and last name are required.');
      return;
    }

    setIsSaving(true);
    try {
      const bio = form.bio.trim();
      const profileData = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim() || undefined,
        phoneNumber: form.phone.trim() || undefined,
      };

      let bioMessage = '';
      try {
        await updateProfile({
          ...profileData,
          bio: bio || undefined,
        });
      } catch {
        await updateProfile(profileData);
        if (bio) {
          bioMessage = ' Bio saved on this device.';
        }
      }

      if (user?.id) {
        await saveLocalProfileBio(user.id, bio);
      }

      let photoMessage = '';
      const photoChanged = Boolean(photo && photo !== savedPhotoUri);

      if (photoChanged && photo && user?.id) {
        await saveLocalProfilePhoto(user.id, photo);
        setSavedPhotoUri(photo);

        try {
          await uploadProfilePhoto(photo);
        } catch {
          photoMessage = ' Your photo is saved on this device.';
        }
      }

      await refreshUser();
      Alert.alert('Success', `Profile updated successfully.${bioMessage}${photoMessage}`);
      router.back();
    } catch (error) {
      Alert.alert('Update failed', getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color="#0056B3" />
          ) : (
            <Text style={styles.doneText}>Done</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarWrap} onPress={pickPhoto}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#CBD5E1" />
                </View>
              )}
              <View style={styles.cameraFab}>
                <Ionicons name="camera" size={16} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={styles.tapLabel}>Tap to change your photo</Text>
          </View>

          {[
            { label: 'First Name', key: 'firstName', placeholder: 'First name', keyboard: 'default' },
            { label: 'Last Name', key: 'lastName', placeholder: 'Last name', keyboard: 'default' },
            { label: 'Email Address', key: 'email', placeholder: 'Your email', keyboard: 'email-address' },
            { label: 'Phone Number', key: 'phone', placeholder: 'Your phone', keyboard: 'phone-pad' },
          ].map((field) => (
            <View key={field.key} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  value={form[field.key as keyof typeof form]}
                  onChangeText={(t) => setForm({ ...form, [field.key]: t })}
                  placeholder={field.placeholder}
                  placeholderTextColor="#94A3B8"
                  keyboardType={field.keyboard as 'default' | 'email-address' | 'phone-pad'}
                  autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                />
              </View>
            </View>
          ))}

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <View style={[styles.inputWrap, styles.bioWrap]}>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                value={form.bio}
                onChangeText={(t) => setForm({ ...form, bio: t })}
                placeholder="Tell others a little about yourself"
                placeholderTextColor="#94A3B8"
                multiline
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontFamily: 'Montserrat_700Bold', color: '#1A1A1A' },
  doneText: { fontSize: 15, fontFamily: 'Montserrat_600SemiBold', color: '#0056B3', paddingHorizontal: 8 },
  body: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 24 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarWrap: { position: 'relative', marginBottom: 8 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraFab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    backgroundColor: '#0056B3',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  tapLabel: { fontSize: 13, color: '#94A3B8', fontFamily: 'Roboto_400Regular', marginTop: 8 },
  fieldGroup: { marginBottom: 24 },
  fieldLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  optional: { fontFamily: 'Roboto_400Regular', textTransform: 'lowercase' },
  inputWrap: {
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 56,
  },
  bioWrap: { height: 'auto', paddingVertical: 15 },
  input: { fontSize: 15, color: '#1A1A1A', fontFamily: 'Roboto_400Regular' },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveBtn: {
    backgroundColor: '#0056B3',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#0056B3',
    shadowOpacity: 0.3,
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontFamily: 'Montserrat_600SemiBold' },
});
