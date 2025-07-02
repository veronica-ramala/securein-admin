import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, Dimensions, Modal, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Users, Calendar, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle, Eye, TrendingUp, X, Phone, Car, Heart, Mail, MapPin, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

interface PendingItem {
  id: string;
  type: 'resident' | 'facility' | 'service';
  title: string;
  description: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
  residentId?: string; // Link to resident details for resident type items
}

interface ResidentDetail {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  address: string;
  dateOfBirth: string;
  occupation: string;
  nationality: string;
  idNumber: string;
  maritalStatus: string;
  monthlyIncome: string;
  familyMembers: Array<{
    name: string;
    relationship: string;
    age: number;
  }>;
  vehicles: Array<{
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
  }>;
  pets: Array<{
    name: string;
    type: string;
    breed: string;
    age: number;
  }>;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  applicationDate: string;
  documents: Array<{
    type: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
  avatar: string;
}

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'resident' | 'facility' | 'service'>('resident');
  const [selectedResident, setSelectedResident] = useState<ResidentDetail | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { logout } = useAuth();

  // Sample resident details data
  const residentDetails: ResidentDetail[] = [
    {
      id: 'res1',
      name: 'John Smith',
      unit: '405',
      phone: '+1 (555) 123-4567',
      email: 'john.smith@email.com',
      address: '123 Main Street, Apt 405, City, State 12345',
      dateOfBirth: '1985-03-15',
      occupation: 'Software Engineer',
      nationality: 'American',
      idNumber: 'ID123456789',
      maritalStatus: 'Married',
      monthlyIncome: '$8,500',
      familyMembers: [
        { name: 'Jane Smith', relationship: 'Spouse', age: 32 },
        { name: 'Tommy Smith', relationship: 'Son', age: 8 },
        { name: 'Sarah Smith', relationship: 'Daughter', age: 5 }
      ],
      vehicles: [
        { make: 'Toyota', model: 'Camry', year: 2020, licensePlate: 'ABC-123', color: 'Silver' },
        { make: 'Honda', model: 'CR-V', year: 2019, licensePlate: 'XYZ-789', color: 'Blue' }
      ],
      pets: [
        { name: 'Max', type: 'Dog', breed: 'Golden Retriever', age: 3 }
      ],
      emergencyContact: {
        name: 'Robert Smith',
        relationship: 'Brother',
        phone: '+1 (555) 987-6543'
      },
      applicationDate: '2024-01-15',
      documents: [
        { type: 'ID Verification', status: 'approved' },
        { type: 'Income Verification', status: 'pending' },
        { type: 'Background Check', status: 'pending' },
        { type: 'References', status: 'approved' }
      ],
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: 'res2',
      name: 'Maria Garcia',
      unit: '208',
      phone: '+1 (555) 456-7890',
      email: 'maria.garcia@email.com',
      address: '456 Oak Avenue, Apt 208, City, State 12345',
      dateOfBirth: '1988-07-22',
      occupation: 'Marketing Manager',
      nationality: 'Mexican-American',
      idNumber: 'ID987654321',
      maritalStatus: 'Married',
      monthlyIncome: '$7,200',
      familyMembers: [
        { name: 'Carlos Garcia', relationship: 'Husband', age: 35 },
        { name: 'Sofia Garcia', relationship: 'Daughter', age: 12 }
      ],
      vehicles: [
        { make: 'Nissan', model: 'Altima', year: 2021, licensePlate: 'DEF-456', color: 'White' }
      ],
      pets: [
        { name: 'Luna', type: 'Cat', breed: 'Persian', age: 2 },
        { name: 'Milo', type: 'Cat', breed: 'Siamese', age: 4 }
      ],
      emergencyContact: {
        name: 'Ana Garcia',
        relationship: 'Sister',
        phone: '+1 (555) 321-9876'
      },
      applicationDate: '2024-01-20',
      documents: [
        { type: 'ID Verification', status: 'approved' },
        { type: 'Income Verification', status: 'approved' },
        { type: 'Background Check', status: 'pending' },
        { type: 'References', status: 'pending' }
      ],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const pendingItems: PendingItem[] = [
    {
      id: '1',
      type: 'resident',
      title: 'New Resident Approval',
      description: 'John Smith application for Unit 405',
      time: '2 mins ago',
      priority: 'high',
      residentId: 'res1'
    },
    {
      id: '2',
      type: 'resident',
      title: 'Resident Application',
      description: 'Maria Garcia application for Unit 208',
      time: '15 mins ago',
      priority: 'medium',
      residentId: 'res2'
    },
    {
      id: '3',
      type: 'facility',
      title: 'Function Hall Booking',
      description: 'Function hall booking by Sarah Johnson',
      time: '30 mins ago',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'facility',
      title: 'Tennis Court Reservation',
      description: 'Tennis court booking by Mike Chen',
      time: '45 mins ago',
      priority: 'low'
    },
    {
      id: '5',
      type: 'service',
      title: 'AC Maintenance Request',
      description: 'AC repair needed in Unit 302',
      time: '1 hour ago',
      priority: 'high'
    },
    {
      id: '6',
      type: 'service',
      title: 'Plumbing Service',
      description: 'Water leak repair in Unit 105',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: '7',
      type: 'service',
      title: 'Electrical Work',
      description: 'Light fixture installation in Unit 201',
      time: '3 hours ago',
      priority: 'medium'
    }
  ];

  // Categorize pending items
  const residentApprovals = pendingItems.filter(item => item.type === 'resident');
  const facilityApprovals = pendingItems.filter(item => item.type === 'facility');
  const maintenanceRequests = pendingItems.filter(item => item.type === 'service');

  // Get current items based on active category
  const getCurrentItems = () => {
    switch (activeCategory) {
      case 'resident': return residentApprovals;
      case 'facility': return facilityApprovals;
      case 'service': return maintenanceRequests;
      default: return residentApprovals;
    }
  };

  const getCurrentTitle = () => {
    switch (activeCategory) {
      case 'resident': return `Resident Approvals (${residentApprovals.length})`;
      case 'facility': return `Facility Approvals (${facilityApprovals.length})`;
      case 'service': return `Maintenance Requests (${maintenanceRequests.length})`;
      default: return 'Pending Approvals';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleProfilePress = () => {
    router.push('/(drawer)/profile');
  };

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

  const openResidentDetail = (residentId: string) => {
    const resident = residentDetails.find(r => r.id === residentId);
    if (resident) {
      setSelectedResident(resident);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedResident(null);
  };

  const handleCardPress = (item: PendingItem) => {
    if (item.type === 'resident' && item.residentId) {
      openResidentDetail(item.residentId);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'resident': return <Users color="#0077B6" size={20} />;
      case 'facility': return <Calendar color="#0077B6" size={20} />;
      case 'service': return <AlertTriangle color="#F59E0B" size={20} />;
      default: return <Users color="#6B7280" size={20} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>SecureIN Admin</Text>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <User color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Approvals Section */}
        <View style={styles.approvalsSection}>
          <Text style={styles.approvalsHeading}>Approvals</Text>
        </View>

        {/* Category Buttons */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'resident' && styles.activeCategoryButton]}
            onPress={() => setActiveCategory('resident')}
          >
            <Users color={activeCategory === 'resident' ? '#FFFFFF' : '#0077B6'} size={20} />
            <Text 
              numberOfLines={1}
              style={[styles.categoryButtonText, activeCategory === 'resident' && styles.activeCategoryButtonText]}
            >
              Residents ({residentApprovals.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'facility' && styles.activeCategoryButton]}
            onPress={() => setActiveCategory('facility')}
          >
            <Calendar color={activeCategory === 'facility' ? '#FFFFFF' : '#10B981'} size={20} />
            <Text 
              numberOfLines={1}
              style={[styles.categoryButtonText, activeCategory === 'facility' && styles.activeCategoryButtonText]}
            >
              Facilities ({facilityApprovals.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryButton, activeCategory === 'service' && styles.activeCategoryButton]}
            onPress={() => setActiveCategory('service')}
          >
            <AlertTriangle color={activeCategory === 'service' ? '#FFFFFF' : '#F59E0B'} size={20} />
            <Text 
              numberOfLines={1}
              style={[styles.categoryButtonText, activeCategory === 'service' && styles.activeCategoryButtonText]}
            >
              Maintenance ({maintenanceRequests.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Approvals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{getCurrentTitle()}</Text>
          {getCurrentItems().length > 0 ? (
            getCurrentItems().map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => handleCardPress(item)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardLeft}>
                    {getTypeIcon(item.type)}
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDescription}>{item.description}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                      <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.cardTime}>{item.time}</Text>
                  </View>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.approveButton}>
                    <CheckCircle color="#FFFFFF" size={16} />
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectButton}>
                    <XCircle color="#FFFFFF" size={16} />
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.viewButton}>
                    <Eye color="#0077B6" size={16} />
                    <Text style={styles.viewText}>View</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No pending {activeCategory === 'resident' ? 'resident approvals' : activeCategory === 'facility' ? 'facility bookings' : 'maintenance requests'}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Simple Test Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%', maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Resident Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedResident ? (
              <ScrollView>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
                  {selectedResident.name}
                </Text>
                <Text>Unit: {selectedResident.unit}</Text>
                <Text>Phone: {selectedResident.phone}</Text>
                <Text>Email: {selectedResident.email}</Text>
                <Text>Date of Birth: {selectedResident.dateOfBirth}</Text>
                <Text>Occupation: {selectedResident.occupation}</Text>
                <Text>Nationality: {selectedResident.nationality}</Text>
                <Text>ID Number: {selectedResident.idNumber}</Text>
                <Text>Marital Status: {selectedResident.maritalStatus}</Text>
                <Text>Monthly Income: {selectedResident.monthlyIncome}</Text>
                <Text>Address: {selectedResident.address}</Text>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                  Family Members:
                </Text>
                {selectedResident.familyMembers.map((member, index) => (
                  <Text key={index}>• {member.name} ({member.relationship}, Age {member.age})</Text>
                ))}
                
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                  Vehicles:
                </Text>
                {selectedResident.vehicles.map((vehicle, index) => (
                  <Text key={index}>• {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.color}, {vehicle.licensePlate})</Text>
                ))}
                
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                  Pets:
                </Text>
                {selectedResident.pets.map((pet, index) => (
                  <Text key={index}>• {pet.name} ({pet.breed} {pet.type}, Age {pet.age})</Text>
                ))}
                
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                  Emergency Contact:
                </Text>
                <Text>• {selectedResident.emergencyContact.name} ({selectedResident.emergencyContact.relationship})</Text>
                <Text>  Phone: {selectedResident.emergencyContact.phone}</Text>
                
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 10 }}>
                  Documents:
                </Text>
                {selectedResident.documents.map((doc, index) => (
                  <Text key={index}>• {doc.type}: {doc.status.toUpperCase()}</Text>
                ))}
              </ScrollView>
            ) : (
              <Text>No resident selected</Text>
            )}
            
            <TouchableOpacity 
              onPress={closeModal}
              style={{ backgroundColor: '#0077B6', padding: 15, borderRadius: 8, marginTop: 20 }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>



      {/* Original Complex Modal - Commented Out */}
      {/*
      <Modal
        animationType="slide"
        transparent={true}
        visible={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resident Application Details</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            {selectedResident && (
              <>
                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  <View style={styles.profileSection}>
                    <Image source={{ uri: selectedResident.avatar }} style={styles.modalAvatar} />
                    <Text style={styles.modalName}>{selectedResident.name}</Text>
                    <Text style={styles.modalUnit}>Unit {selectedResident.unit}</Text>
                    <Text style={styles.applicationDate}>Applied on {selectedResident.applicationDate}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.detailRow}>
                      <Users color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Full Name:</Text>
                      <Text style={styles.detailValue}>{selectedResident.name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Calendar color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Date of Birth:</Text>
                      <Text style={styles.detailValue}>{selectedResident.dateOfBirth}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Nationality:</Text>
                      <Text style={styles.detailValue}>{selectedResident.nationality}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>ID Number:</Text>
                      <Text style={styles.detailValue}>{selectedResident.idNumber}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Heart color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Marital Status:</Text>
                      <Text style={styles.detailValue}>{selectedResident.maritalStatus}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Users color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Occupation:</Text>
                      <Text style={styles.detailValue}>{selectedResident.occupation}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <TrendingUp color="#10B981" size={16} />
                      <Text style={styles.detailLabel}>Monthly Income:</Text>
                      <Text style={styles.detailValue}>{selectedResident.monthlyIncome}</Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
                    <View style={styles.detailRow}>
                      <Phone color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Phone:</Text>
                      <Text style={styles.detailValue}>{selectedResident.phone}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Mail color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>{selectedResident.email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MapPin color="#0077B6" size={16} />
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>{selectedResident.address}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Family Members ({selectedResident.familyMembers.length})</Text>
                    {selectedResident.familyMembers.map((member, index) => (
                      <View key={index} style={styles.listItem}>
                        <Users color="#10B981" size={16} />
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>{member.name}</Text>
                          <Text style={styles.listItemSubtitle}>{member.relationship}, Age {member.age}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Vehicles ({selectedResident.vehicles.length})</Text>
                    {selectedResident.vehicles.map((vehicle, index) => (
                      <View key={index} style={styles.listItem}>
                        <Car color="#0077B6" size={16} />
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
                          <Text style={styles.listItemSubtitle}>{vehicle.color} • {vehicle.licensePlate}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Pets ({selectedResident.pets.length})</Text>
                    {selectedResident.pets.map((pet, index) => (
                      <View key={index} style={styles.listItem}>
                        <Heart color="#EF4444" size={16} />
                        <View style={styles.listItemContent}>
                          <Text style={styles.listItemTitle}>{pet.name}</Text>
                          <Text style={styles.listItemSubtitle}>{pet.breed} {pet.type}, Age {pet.age}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Emergency Contact</Text>
                    <View style={styles.listItem}>
                      <Phone color="#EF4444" size={16} />
                      <View style={styles.listItemContent}>
                        <Text style={styles.listItemTitle}>{selectedResident.emergencyContact.name}</Text>
                        <Text style={styles.listItemSubtitle}>{selectedResident.emergencyContact.relationship} • {selectedResident.emergencyContact.phone}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Document Status</Text>
                    {selectedResident.documents.map((doc, index) => (
                      <View key={index} style={styles.documentItem}>
                        <Text style={styles.documentType}>{doc.type}</Text>
                        <View style={[
                          styles.documentStatus,
                          { backgroundColor: doc.status === 'approved' ? '#10B981' : doc.status === 'pending' ? '#F59E0B' : '#EF4444' }
                        ]}>
                          <Text style={styles.documentStatusText}>{doc.status.toUpperCase()}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.closeModalButton} onPress={closeModal}>
                    <Eye color="#FFFFFF" size={16} />
                    <Text style={styles.closeModalText}>Close Details</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
      */}
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
    marginBottom: 8,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: screenWidth * 0.05, // 5% of screen width
  },
  approvalsSection: {
    marginBottom: 16,
  },
  approvalsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'left',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: screenWidth * 0.05, // 5% of screen width
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  approveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  rejectText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  viewText: {
    color: '#0077B6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: screenWidth * 0.05, // 5% of screen width
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 6,
    gap: 6,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
    minHeight: 58,
  },
  activeCategoryButton: {
    backgroundColor: '#0077B6',
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
    flexShrink: 0,
  },
  activeCategoryButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalUnit: {
    fontSize: 18,
    color: '#0077B6',
    fontWeight: '600',
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
    minWidth: 60,
  },
  detailValue: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  documentType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  documentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  documentStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  approveModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  approveModalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  rejectModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
  },
  rejectModalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  closeModalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  closeModalText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});