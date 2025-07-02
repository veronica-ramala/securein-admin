import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Image, Dimensions, Linking, Alert, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Trash2, UserCheck, Phone, MessageSquare, CircleCheck as CheckCircle, Clock, X, Edit3, Save, User, Camera, ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const { width: screenWidth } = Dimensions.get('window');

interface Staff {
  id: string;
  name: string;
  role: 'security' | 'maintenance' | 'cleaning' | 'management';
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty';
  shift: string;
  joinDate: string;
  tasksAssigned: number;
  tasksCompleted: number;
  avatar: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  location: string;
}

export default function Staff() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState<Staff | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>([]);

  // Initialize staff data
  React.useEffect(() => {
    const initialStaff: Staff[] = [
    {
      id: '1',
      name: 'James Wilson',
      role: 'security',
      phone: '+1 (555) 111-2222',
      email: 'james.wilson@securein.com',
      status: 'on-duty',
      shift: 'Day (6AM - 6PM)',
      joinDate: '2023-01-15',
      tasksAssigned: 12,
      tasksCompleted: 10,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Maria Garcia',
      role: 'cleaning',
      phone: '+1 (555) 333-4444',
      email: 'maria.garcia@securein.com',
      status: 'active',
      shift: 'Morning (8AM - 4PM)',
      joinDate: '2023-02-20',
      tasksAssigned: 8,
      tasksCompleted: 8,
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Robert Kim',
      role: 'maintenance',
      phone: '+1 (555) 555-6666',
      email: 'robert.kim@securein.com',
      status: 'on-duty',
      shift: 'Day (8AM - 5PM)',
      joinDate: '2023-03-10',
      tasksAssigned: 15,
      tasksCompleted: 13,
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '4',
      name: 'Lisa Thompson',
      role: 'security',
      phone: '+1 (555) 777-8888',
      email: 'lisa.thompson@securein.com',
      status: 'off-duty',
      shift: 'Night (6PM - 6AM)',
      joinDate: '2023-01-05',
      tasksAssigned: 9,
      tasksCompleted: 9,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '5',
      name: 'David Brown',
      role: 'management',
      phone: '+1 (555) 999-0000',
      email: 'david.brown@securein.com',
      status: 'active',
      shift: 'Business Hours',
      joinDate: '2022-12-01',
      tasksAssigned: 6,
      tasksCompleted: 5,
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
    ];
    setStaffList(initialStaff);
  }, []);

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Pool maintenance',
      description: 'Clean and check chemical levels',
      assignedTo: 'Robert Kim',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-24',
      location: 'Community Pool'
    },
    {
      id: '2',
      title: 'Lobby cleaning',
      description: 'Deep clean main lobby area',
      assignedTo: 'Maria Garcia',
      priority: 'medium',
      status: 'completed',
      dueDate: '2024-01-23',
      location: 'Main Lobby'
    },
    {
      id: '3',
      title: 'Security round',
      description: 'Evening security patrol',
      assignedTo: 'James Wilson',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-24',
      location: 'Entire complex'
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'security': return '#EF4444';
      case 'maintenance': return '#F59E0B';
      case 'cleaning': return '#10B981';
      case 'management': return '#0077B6';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty': return '#10B981';
      case 'off-duty': return '#6B7280';
      case 'active': return '#0077B6';
      case 'inactive': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const openStaffDetail = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStaff(null);
    setIsEditing(false);
    setEditedStaff(null);
  };

  const handleEditStaff = (staffId: string) => {
    const staffMember = staffList.find(s => s.id === staffId);
    if (staffMember) {
      setEditedStaff({ ...staffMember });
      setIsEditing(true);
    }
  };

  const handleSaveStaff = () => {
    if (editedStaff) {
      // Update the staff list
      const updatedStaffList = staffList.map(staff =>
        staff.id === editedStaff.id ? editedStaff : staff
      );
      setStaffList(updatedStaffList);
      
      // Update selected staff if it's the same person
      if (selectedStaff && selectedStaff.id === editedStaff.id) {
        setSelectedStaff(editedStaff);
      }
      
      // Exit edit mode
      setIsEditing(false);
      setEditedStaff(null);
      
      Alert.alert('Success', 'Staff details updated successfully!');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedStaff(null);
  };

  const updateEditedStaffField = (field: keyof Staff, value: string | number) => {
    if (editedStaff) {
      setEditedStaff({
        ...editedStaff,
        [field]: value
      });
    }
  };

  const handleCallStaff = async (phoneNumber: string) => {
    console.log('Call button pressed! Phone number:', phoneNumber);
    
    // Show confirmation first
    Alert.alert(
      'Call Staff',
      `Do you want to call ${phoneNumber}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: async () => {
            try {
              const phoneUrl = `tel:${phoneNumber}`;
              await Linking.openURL(phoneUrl);
            } catch (error) {
              console.error('Error opening phone dialer:', error);
              Alert.alert(
                'Error',
                'Failed to open phone dialer. Please try again.',
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  const handleMessageStaff = async (phoneNumber: string) => {
    try {
      const smsUrl = `sms:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(smsUrl);
      
      if (canOpen) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert(
          'Unable to Send Message',
          'Your device does not support sending text messages.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening SMS app:', error);
      Alert.alert(
        'Error',
        'Failed to open messaging app. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to change your profile picture.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleUpdateProfilePicture = async () => {
    if (!editedStaff) return;

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert(
      'Update Profile Picture',
      'Choose how you want to update your profile picture',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: () => openImagePicker('camera'),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => openImagePicker('gallery'),
        },
      ]
    );
  };

  const openImagePicker = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      
      if (source === 'camera') {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to take photos.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        updateEditedStaffField('avatar', imageUri);
        Alert.alert('Success', 'Profile picture updated! Don\'t forget to save your changes.');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert(
        'Error',
        'Failed to update profile picture. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Staff Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{staffList.length}</Text>
            <Text style={styles.statLabel}>Total Staff</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{staffList.filter(s => s.status === 'on-duty').length}</Text>
            <Text style={styles.statLabel}>On Duty</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{tasks.filter(t => t.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
        </View>

        {/* Staff List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Staff Members</Text>
          {staffList.map((staffMember) => (
            <View 
              key={staffMember.id} 
              style={styles.staffCard}
            >
              <TouchableOpacity 
                onPress={() => openStaffDetail(staffMember)}
                activeOpacity={0.7}
                style={styles.staffMainContent}
              >
                <View style={styles.staffHeader}>
                  <View style={styles.staffInfo}>
                    <Image source={{ uri: staffMember.avatar }} style={styles.staffAvatar} />
                    <View style={styles.staffDetails}>
                      <Text style={styles.staffName}>{staffMember.name}</Text>
                      <View style={styles.roleContainer}>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleColor(staffMember.role) }]}>
                          <Text style={styles.roleText}>{staffMember.role.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.staffShift}>{staffMember.shift}</Text>
                      </View>
                      <Text style={styles.staffPhone}>{staffMember.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(staffMember.status) }
                    ]}>
                      <Text style={styles.statusText}>{staffMember.status.replace('-', ' ').toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.taskProgress}>
                  <Text style={styles.progressLabel}>
                    Tasks: {staffMember.tasksCompleted}/{staffMember.tasksAssigned} completed
                  </Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${(staffMember.tasksCompleted / staffMember.tasksAssigned) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.staffActions}>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={() => {
                    console.log('CALL BUTTON PRESSED!!!');
                    handleCallStaff(staffMember.phone);
                  }}
                  activeOpacity={0.7}
                >
                  <Phone color="#0077B6" size={16} />
                  <Text style={styles.contactText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.messageButton}
                  onPress={() => {
                    console.log('MESSAGE BUTTON PRESSED!!!');
                    handleMessageStaff(staffMember.phone);
                  }}
                  activeOpacity={0.7}
                >
                  <MessageSquare color="#0077B6" size={16} />
                  <Text style={styles.messageText}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Tasks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={styles.taskHeader}>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDescription}>{task.description}</Text>
                  <Text style={styles.taskAssignee}>Assigned to: {task.assignedTo}</Text>
                </View>
                <View style={styles.taskBadges}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
                  </View>
                  <View style={styles.taskStatus}>
                    {task.status === 'completed' && <CheckCircle color="#10B981" size={20} />}
                    {task.status === 'in-progress' && <Clock color="#F59E0B" size={20} />}
                    {task.status === 'pending' && <Clock color="#6B7280" size={20} />}
                  </View>
                </View>
              </View>
              <View style={styles.taskFooter}>
                <Text style={styles.taskLocation}>{task.location}</Text>
                <Text style={styles.taskDueDate}>Due: {task.dueDate}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Staff Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Staff Details' : 'Staff Details'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            {!isEditing && selectedStaff && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.profileSection}>
                  <Image source={{ uri: selectedStaff.avatar }} style={styles.modalAvatar} />
                  <Text style={styles.modalName}>{selectedStaff.name}</Text>
                  <Text style={styles.modalRole}>{selectedStaff.role}</Text>
                  
                  <View style={styles.profileEditAction}>
                    <TouchableOpacity 
                      style={styles.editButton}
                      onPress={() => handleEditStaff(selectedStaff.id)}
                      activeOpacity={0.7}
                    >
                      <Edit3 color="#FFFFFF" size={18} />
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Personal Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Join Date:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.joinDate}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Work Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.status}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Shift:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.shift}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tasks Assigned:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.tasksAssigned}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tasks Completed:</Text>
                    <Text style={styles.detailValue}>{selectedStaff.tasksCompleted}</Text>
                  </View>
                </View>
              </ScrollView>
            )}

            {isEditing && editedStaff && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.profileSection}>
                  <View style={styles.avatarContainer}>
                    <Image source={{ uri: editedStaff.avatar }} style={styles.modalAvatar} />
                    <TouchableOpacity 
                      style={styles.changePhotoButton}
                      onPress={handleUpdateProfilePicture}
                      activeOpacity={0.7}
                    >
                      <Camera color="#FFFFFF" size={16} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity 
                    style={styles.changePhotoTextButton}
                    onPress={handleUpdateProfilePicture}
                    activeOpacity={0.7}
                  >
                    <ImageIcon color="#0077B6" size={18} />
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.editFormActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={handleCancelEdit}
                      activeOpacity={0.7}
                    >
                      <X color="#EF4444" size={18} />
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.saveButton}
                      onPress={handleSaveStaff}
                      activeOpacity={0.7}
                    >
                      <Save color="#FFFFFF" size={18} />
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Personal Information</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Name</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedStaff.name}
                      onChangeText={(text) => updateEditedStaffField('name', text)}
                      placeholder="Enter full name"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Phone</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedStaff.phone}
                      onChangeText={(text) => updateEditedStaffField('phone', text)}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedStaff.email}
                      onChangeText={(text) => updateEditedStaffField('email', text)}
                      placeholder="Enter email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Role</Text>
                    <View style={styles.roleSelector}>
                      {['security', 'maintenance', 'cleaning', 'management'].map((role) => (
                        <TouchableOpacity
                          key={role}
                          style={[
                            styles.roleOption,
                            editedStaff.role === role && styles.roleOptionSelected
                          ]}
                          onPress={() => updateEditedStaffField('role', role as Staff['role'])}
                        >
                          <Text style={[
                            styles.roleOptionText,
                            editedStaff.role === role && styles.roleOptionTextSelected
                          ]}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.editSection}>
                  <Text style={styles.editSectionTitle}>Work Information</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Status</Text>
                    <View style={styles.statusSelector}>
                      {['active', 'inactive', 'on-duty', 'off-duty'].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusOption,
                            editedStaff.status === status && styles.statusOptionSelected
                          ]}
                          onPress={() => updateEditedStaffField('status', status as Staff['status'])}
                        >
                          <Text style={[
                            styles.statusOptionText,
                            editedStaff.status === status && styles.statusOptionTextSelected
                          ]}>
                            {status.replace('-', ' ').toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Shift</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedStaff.shift}
                      onChangeText={(text) => updateEditedStaffField('shift', text)}
                      placeholder="Enter shift schedule"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Tasks Assigned</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedStaff.tasksAssigned.toString()}
                      onChangeText={(text) => updateEditedStaffField('tasksAssigned', parseInt(text) || 0)}
                      placeholder="Number of tasks assigned"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Tasks Completed</Text>
                    <TextInput
                      style={styles.textInput}
                      value={editedStaff.tasksCompleted.toString()}
                      onChangeText={(text) => updateEditedStaffField('tasksCompleted', parseInt(text) || 0)}
                      placeholder="Number of tasks completed"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: screenWidth * 0.05, // 5% of screen width
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: screenWidth * 0.05, // 5% of screen width
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  staffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  staffMainContent: {
    padding: screenWidth * 0.05, // 5% of screen width
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  staffInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  staffAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  staffShift: {
    fontSize: 12,
    color: '#6B7280',
  },
  staffPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taskProgress: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  staffActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  contactText: {
    color: '#0077B6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  messageText: {
    color: '#0077B6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  taskAssignee: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '600',
  },
  taskBadges: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taskStatus: {
    alignItems: 'center',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskDueDate: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileEditAction: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalRole: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 8,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 160,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Keep the old styles for backward compatibility if needed elsewhere
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077B6',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    minWidth: 160,
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#0077B6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Edit Form Styles
  editFormActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },

  editSection: {
    marginBottom: 24,
  },
  
  editSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  
  inputContainer: {
    marginBottom: 20,
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  
  roleOptionSelected: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  
  roleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  
  roleOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  
  statusOptionSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  
  statusOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  
  statusOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Profile Picture Edit Styles
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0077B6',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  changePhotoTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  
  changePhotoText: {
    color: '#0077B6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
});