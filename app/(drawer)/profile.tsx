import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Mail,
  Phone,
  Shield,
  Settings,
  Bell,
  Lock,
  Moon,
  Globe,
  LogOut,
  Edit3,
  ArrowLeft,
  Save,
  X,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const { logout, user } = useAuth();

  // Profile data state
  const [profileData, setProfileData] = useState({
    fullName: 'System Administrator',
    email: 'admin@securein.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Administrator',
  });

  // Temporary editing state
  const [editData, setEditData] = useState(profileData);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    if (isEditing) {
      // Cancel editing
      setEditData(profileData);
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    // Validate the data
    if (!editData.fullName.trim() || !editData.email.trim() || !editData.phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Save the data
    setProfileData(editData);
    setIsEditing(false);
    
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Profile</Text>
          <View style={styles.headerActions}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Save color="#FFFFFF" size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleEditProfile}>
                  <X color="#FFFFFF" size={24} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Edit3 color="#FFFFFF" size={24} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
              }}
              style={styles.avatar}
            />
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
            </View>
          </View>
          <Text style={styles.adminName}>{profileData.fullName}</Text>
          <Text style={styles.adminRole}>{profileData.role}</Text>
          <Text style={styles.adminEmail}>{profileData.email}</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <User color="#0077B6" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.fullName}
                    onChangeText={(text) => setEditData({...editData, fullName: text})}
                    placeholder="Enter full name"
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.infoValue}>{profileData.fullName}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Mail color="#0077B6" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.email}
                    onChangeText={(text) => setEditData({...editData, email: text})}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                ) : (
                  <Text style={styles.infoValue}>{profileData.email}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Phone color="#0077B6" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.phone}
                    onChangeText={(text) => setEditData({...editData, phone: text})}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{profileData.phone}</Text>
                )}
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Shield color="#0077B6" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Role</Text>
                {isEditing ? (
                  <TextInput
                    style={styles.infoInput}
                    value={editData.role}
                    onChangeText={(text) => setEditData({...editData, role: text})}
                    placeholder="Enter role"
                    autoCapitalize="words"
                  />
                ) : (
                  <Text style={styles.infoValue}>{profileData.role}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Bell color="#0077B6" size={20} />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#D1D5DB', true: '#0077B6' }}
                thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Moon color="#0077B6" size={20} />
                <Text style={styles.settingLabel}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#D1D5DB', true: '#0077B6' }}
                thumbColor={darkMode ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Lock color="#0077B6" size={20} />
                <Text style={styles.settingLabel}>Auto Lock</Text>
              </View>
              <Switch
                value={autoLock}
                onValueChange={setAutoLock}
                trackColor={{ false: '#D1D5DB', true: '#0077B6' }}
                thumbColor={autoLock ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Lock color="#0077B6" size={20} />
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Globe color="#0077B6" size={20} />
            <Text style={styles.actionButtonText}>Language Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Settings color="#0077B6" size={20} />
            <Text style={styles.actionButtonText}>App Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#FFFFFF" size={20} />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: screenWidth * 0.05,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    marginRight: 8,
  },
  cancelButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  content: {
    flex: 1,
    padding: screenWidth * 0.05,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  adminRole: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
    marginBottom: 8,
  },
  adminEmail: {
    fontSize: 14,
    color: '#6B7280',
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoItem: {
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
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    marginTop: 4,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
});