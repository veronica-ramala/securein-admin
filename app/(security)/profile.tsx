import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft,
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Calendar,
  LogOut,
  Settings,
  Bell
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SecurityProfile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#059669', '#10B981', '#34D399']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={styles.avatar}
            >
              <Shield color="#FFFFFF" size={40} />
            </LinearGradient>
          </View>
          <Text style={styles.userName}>{user?.username}</Text>
          <Text style={styles.userRole}>Security Officer</Text>
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user?.username}</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Mail color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.username}@securein.com</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Phone color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>+1 (555) 123-4567</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <MapPin color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>Security & Safety</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <Calendar color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Joined</Text>
                <Text style={styles.infoValue}>January 2024</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell color="#6B7280" size={20} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Text style={styles.settingValue}>Enabled</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Settings color="#6B7280" size={20} />
              <Text style={styles.settingText}>App Settings</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#FFFFFF" size={20} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userRole: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#059669',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
});