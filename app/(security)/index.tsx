import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Scan, 
  Users, 
  Search, 
  User, 
  Phone, 
  MapPin, 
  Clock,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

// Mock resident data
const mockResidents = [
  {
    id: '1',
    name: 'John Smith',
    apartment: 'A-101',
    phone: '+1 234-567-8901',
    status: 'active',
    lastSeen: '2024-01-15 14:30',
    emergencyContact: 'Jane Smith - +1 234-567-8902'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    apartment: 'B-205',
    phone: '+1 234-567-8903',
    status: 'active',
    lastSeen: '2024-01-15 12:15',
    emergencyContact: 'Carlos Garcia - +1 234-567-8904'
  },
  {
    id: '3',
    name: 'David Johnson',
    apartment: 'C-302',
    phone: '+1 234-567-8905',
    status: 'inactive',
    lastSeen: '2024-01-14 18:45',
    emergencyContact: 'Sarah Johnson - +1 234-567-8906'
  },
  {
    id: '4',
    name: 'Lisa Chen',
    apartment: 'A-405',
    phone: '+1 234-567-8907',
    status: 'active',
    lastSeen: '2024-01-15 16:20',
    emergencyContact: 'Michael Chen - +1 234-567-8908'
  },
];

export default function SecurityDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResidents, setFilteredResidents] = useState(mockResidents);

  const handleScan = () => {
    Alert.alert(
      'QR Code Scanner',
      'QR Code scanner would open here. This feature requires camera permissions.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Scanner', onPress: () => console.log('Opening scanner...') }
      ]
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredResidents(mockResidents);
    } else {
      const filtered = mockResidents.filter(
        resident =>
          resident.name.toLowerCase().includes(query.toLowerCase()) ||
          resident.apartment.toLowerCase().includes(query.toLowerCase()) ||
          resident.phone.includes(query)
      );
      setFilteredResidents(filtered);
    }
  };

  const renderResidentCard = ({ item }: { item: typeof mockResidents[0] }) => (
    <View style={styles.residentCard}>
      <View style={styles.residentHeader}>
        <View style={styles.residentInfo}>
          <Text style={styles.residentName}>{item.name}</Text>
          <Text style={styles.apartmentNumber}>{item.apartment}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'active' ? '#10B981' : '#EF4444' }
        ]}>
          {item.status === 'active' ? (
            <CheckCircle color="#FFFFFF" size={16} />
          ) : (
            <XCircle color="#FFFFFF" size={16} />
          )}
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <View style={styles.residentDetails}>
        <View style={styles.detailRow}>
          <Phone color="#6B7280" size={16} />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock color="#6B7280" size={16} />
          <Text style={styles.detailText}>Last seen: {item.lastSeen}</Text>
        </View>
        <View style={styles.detailRow}>
          <User color="#6B7280" size={16} />
          <Text style={styles.detailText}>Emergency: {item.emergencyContact}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981', '#34D399']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Shield color="#FFFFFF" size={24} />
            <Text style={styles.headerTitle}>Security Dashboard</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(security)/profile')}
          >
            <User color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeText}>Welcome, {user?.username}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={styles.scanButtonGradient}
            >
              <Scan color="#FFFFFF" size={32} />
              <Text style={styles.scanButtonText}>Scan QR Code</Text>
              <Text style={styles.scanButtonSubtext}>Scan visitor or resident QR codes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Resident Search */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resident Directory</Text>
          <View style={styles.searchContainer}>
            <Search color="#6B7280" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, apartment, or phone..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </View>

        {/* Residents List */}
        <View style={styles.section}>
          <Text style={styles.sectionSubtitle}>
            {filteredResidents.length} resident{filteredResidents.length !== 1 ? 's' : ''} found
          </Text>
          <FlatList
            data={filteredResidents}
            renderItem={renderResidentCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  scanButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonGradient: {
    padding: 24,
    alignItems: 'center',
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  scanButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  residentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  residentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  apartmentNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  residentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
});