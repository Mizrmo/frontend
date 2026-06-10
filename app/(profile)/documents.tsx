import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadDriverDocuments, type DriverDocumentsUpload } from '../../src/api/drivers';
import { getApiErrorMessage } from '../../src/api/errors';

interface Document {
  id: string;
  title: string;
  subtitle: string;
  status: 'verified' | 'pending' | 'missing';
  imageKey: string;
  apiField: keyof DriverDocumentsUpload;
}

export default function UserDocumentsScreen() {
  const router = useRouter();
  const [images, setImages] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const documents: Document[] = [
    {
      id: 'ghana_card',
      title: 'Ghana Card',
      subtitle: 'National ID (front)',
      status: images.ghana_card ? 'pending' : 'missing',
      imageKey: 'ghana_card',
      apiField: 'ghanaCardFront',
    },
    {
      id: 'drivers_license',
      title: "Driver's License",
      subtitle: 'License (front)',
      status: images.drivers_license ? 'pending' : 'missing',
      imageKey: 'drivers_license',
      apiField: 'licenseFront',
    },
    {
      id: 'vehicle_reg',
      title: 'Vehicle Registration',
      subtitle: 'Roadworthy certificate',
      status: images.vehicle_reg ? 'pending' : 'missing',
      imageKey: 'vehicle_reg',
      apiField: 'roadWorthiness',
    },
  ];

  const statusColors = { verified: '#10B981', pending: '#F59E0B', missing: '#EF4444' };
  const statusLabels = { verified: 'Verified', pending: 'Under Review', missing: 'Upload Required' };

  const pickDocument = async (doc: Document) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Allow photo library access to upload documents.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
    });
    if (result.canceled) {
      return;
    }

    const uri = result.assets[0].uri;
    setUploading(doc.id);
    setImages((prev) => ({ ...prev, [doc.imageKey]: uri }));

    try {
      await uploadDriverDocuments({ [doc.apiField]: uri });
      Alert.alert('Uploaded', `${doc.title} has been submitted for review.`);
    } catch (error) {
      setImages((prev) => {
        const next = { ...prev };
        delete next[doc.imageKey];
        return next;
      });
      Alert.alert('Upload failed', getApiErrorMessage(error));
    } finally {
      setUploading(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Documents</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.infoText}>
          Upload clear photos of your documents. All documents are reviewed within 24 hours.
        </Text>

        {documents.map((doc) => (
          <View key={doc.id} style={styles.docCard}>
            <View style={styles.docLeft}>
              <View style={[styles.docIconBox, { backgroundColor: statusColors[doc.status] + '15' }]}>
                <MaterialIcons name="description" size={24} color={statusColors[doc.status]} />
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docSubtitle}>{doc.subtitle}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[doc.status] + '20' }]}>
                  <Text style={[styles.statusText, { color: statusColors[doc.status] }]}>
                    {statusLabels[doc.status]}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.uploadBtn}
              onPress={() => pickDocument(doc)}
              disabled={uploading === doc.id}
            >
              {uploading === doc.id ? (
                <ActivityIndicator size="small" color="#0056B3" />
              ) : images[doc.imageKey] ? (
                <Image source={{ uri: images[doc.imageKey] }} style={styles.uploadedThumb} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color="#0056B3" />
              )}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  backText: { fontSize: 16, color: '#1A1A1A', marginLeft: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  content: { padding: 20, paddingBottom: 40 },
  infoText: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 25, paddingHorizontal: 4 },
  docCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
  },
  docLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  docIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  docInfo: { flex: 1, marginLeft: 14 },
  docTitle: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  docSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2, marginBottom: 8 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  uploadBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  uploadedThumb: { width: 46, height: 46, borderRadius: 10 },
});
