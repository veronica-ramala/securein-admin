import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, Clock, User, MapPin, X, CheckCircle, AlertTriangle, MessageCircle, Star } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Complaint {
  id: string;
  residentName: string;
  unit: string;
  category: 'noise' | 'maintenance' | 'neighbor' | 'facility' | 'management' | 'other';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'in progress' | 'resolved' | 'closed';
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  residentAvatar: string;
  residentPhone: string;
  residentEmail: string;
}

export default function Complaints() {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in progress' | 'resolved'>('all');

  const complaints: Complaint[] = [
    {
      id: '1',
      residentName: 'Sarah Johnson',
      unit: 'A-205',
      category: 'noise',
      title: 'Loud music from neighboring unit',
      description: 'The neighbors in unit A-206 have been playing loud music every night after 10 PM. This has been going on for the past week and is affecting my sleep.',
      timestamp: '2024-01-24 09:30',
      status: 'pending',
      priority: 'medium',
      assignedTo: 'Security Team',
      residentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      residentPhone: '+1 (555) 123-4567',
      residentEmail: 'sarah.johnson@email.com'
    },
    {
      id: '2',
      residentName: 'Michael Chen',
      unit: 'B-301',
      category: 'maintenance',
      title: 'Water leak in bathroom',
      description: 'There is a persistent water leak under the bathroom sink. Water is pooling on the floor and may cause damage if not fixed soon.',
      timestamp: '2024-01-24 08:15',
      status: 'in progress',
      priority: 'high',
      assignedTo: 'Maintenance Team',
      residentAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      residentPhone: '+1 (555) 987-6543',
      residentEmail: 'michael.chen@email.com'
    },
    {
      id: '3',
      residentName: 'Emily Rodriguez',
      unit: 'C-102',
      category: 'facility',
      title: 'Elevator out of service',
      description: 'The elevator in Building C has been out of service for 3 days. This is causing inconvenience for elderly residents and those with mobility issues.',
      timestamp: '2024-01-23 16:45',
      status: 'resolved',
      priority: 'high',
      assignedTo: 'Facility Management',
      residentAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      residentPhone: '+1 (555) 456-7890',
      residentEmail: 'emily.rodriguez@email.com'
    },
    {
      id: '4',
      residentName: 'David Wilson',
      unit: 'A-101',
      category: 'neighbor',
      title: 'Parking space violation',
      description: 'Someone keeps parking in my assigned parking space #15. This has happened multiple times this week.',
      timestamp: '2024-01-23 14:20',
      status: 'pending',
      priority: 'low',
      residentAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      residentPhone: '+1 (555) 321-9876',
      residentEmail: 'david.wilson@email.com'
    },
    {
      id: '5',
      residentName: 'Lisa Thompson',
      unit: 'B-205',
      category: 'management',
      title: 'Delayed response to maintenance requests',
      description: 'I have submitted multiple maintenance requests over the past month but have not received any response or action.',
      timestamp: '2024-01-22 11:30',
      status: 'in progress',
      priority: 'medium',
      assignedTo: 'Property Manager',
      residentAvatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      residentPhone: '+1 (555) 654-3210',
      residentEmail: 'lisa.thompson@email.com'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'noise': return '#F59E0B';
      case 'maintenance': return '#EF4444';
      case 'neighbor': return '#8B5CF6';
      case 'facility': return '#0077B6';
      case 'management': return '#10B981';
      case 'other': return '#6B7280';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in progress': return '#0077B6';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'noise': return <MessageCircle color="#F59E0B" size={20} />;
      case 'maintenance': return <AlertTriangle color="#EF4444" size={20} />;
      case 'neighbor': return <User color="#8B5CF6" size={20} />;
      case 'facility': return <MapPin color="#0077B6" size={20} />;
      case 'management': return <Star color="#10B981" size={20} />;
      default: return <MessageSquare color="#6B7280" size={20} />;
    }
  };

  const getFilteredComplaints = () => {
    if (activeFilter === 'all') return complaints;
    return complaints.filter(complaint => complaint.status === activeFilter);
  };

  const openComplaintDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedComplaint(null);
  };

  const handleStatusUpdate = (complaintId: string, newStatus: string) => {
    console.log(`Update complaint ${complaintId} to ${newStatus}`);
    closeModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Complaints Center</Text>
          <MessageSquare color="#FFFFFF" size={24} />
        </View>
        <Text style={styles.headerSubtitle}>Resident Feedback Management</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'all' && styles.activeFilterButtonText]}>
              All ({complaints.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'pending' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('pending')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'pending' && styles.activeFilterButtonText]}>
              Pending ({complaints.filter(c => c.status === 'pending').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'in progress' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('in progress')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'in progress' && styles.activeFilterButtonText]}>
              In Progress ({complaints.filter(c => c.status === 'in progress').length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, activeFilter === 'resolved' && styles.activeFilterButton, { marginRight: 0 }]}
            onPress={() => setActiveFilter('resolved')}
          >
            <Text style={[styles.filterButtonText, activeFilter === 'resolved' && styles.activeFilterButtonText]}>
              Resolved ({complaints.filter(c => c.status === 'resolved').length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Complaints List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complaints ({getFilteredComplaints().length})</Text>
          {getFilteredComplaints().map((complaint) => (
            <TouchableOpacity 
              key={complaint.id} 
              style={[styles.complaintCard, { borderLeftColor: getCategoryColor(complaint.category) }]}
              onPress={() => openComplaintDetail(complaint)}
            >
              <View style={styles.complaintHeader}>
                <View style={styles.complaintInfo}>
                  <View style={styles.residentInfo}>
                    <Image source={{ uri: complaint.residentAvatar }} style={styles.residentAvatar} />
                    <View>
                      <Text style={styles.complaintResident}>{complaint.residentName}</Text>
                      <Text style={styles.complaintUnit}>Unit {complaint.unit}</Text>
                    </View>
                  </View>
                  <View style={styles.complaintContent}>
                    <View style={styles.complaintTitleRow}>
                      {getCategoryIcon(complaint.category)}
                      <Text style={styles.complaintTitle}>{complaint.title}</Text>
                    </View>
                    <Text style={styles.complaintDescription} numberOfLines={2}>
                      {complaint.description}
                    </Text>
                    <View style={styles.complaintMeta}>
                      <View style={styles.complaintMetaItem}>
                        <Clock color="#6B7280" size={14} />
                        <Text style={styles.complaintMetaText}>{complaint.timestamp}</Text>
                      </View>
                      {complaint.assignedTo && (
                        <View style={styles.complaintMetaItem}>
                          <User color="#6B7280" size={14} />
                          <Text style={styles.complaintMetaText}>{complaint.assignedTo}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View style={styles.complaintBadges}>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(complaint.priority) }]}>
                    <Text style={styles.priorityText}>{complaint.priority.toUpperCase()}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) }]}>
                    <Text style={styles.statusText}>{complaint.status.toUpperCase()}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Complaint Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complaint Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            {selectedComplaint && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalResidentInfo}>
                  <Image source={{ uri: selectedComplaint.residentAvatar }} style={styles.modalAvatar} />
                  <View>
                    <Text style={styles.modalResidentName}>{selectedComplaint.residentName}</Text>
                    <Text style={styles.modalResidentUnit}>Unit {selectedComplaint.unit}</Text>
                    <Text style={styles.modalResidentContact}>{selectedComplaint.residentPhone}</Text>
                    <Text style={styles.modalResidentContact}>{selectedComplaint.residentEmail}</Text>
                  </View>
                </View>

                <View style={styles.complaintDetailSection}>
                  <Text style={styles.detailSectionTitle}>Complaint Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={[styles.detailValue, { color: getCategoryColor(selectedComplaint.category) }]}>
                      {selectedComplaint.category.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Priority:</Text>
                    <Text style={[styles.detailValue, { color: getPriorityColor(selectedComplaint.priority) }]}>
                      {selectedComplaint.priority.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: getStatusColor(selectedComplaint.status) }]}>
                      {selectedComplaint.status.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Submitted:</Text>
                    <Text style={styles.detailValue}>{selectedComplaint.timestamp}</Text>
                  </View>
                  {selectedComplaint.assignedTo && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Assigned To:</Text>
                      <Text style={styles.detailValue}>{selectedComplaint.assignedTo}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.complaintDetailSection}>
                  <Text style={styles.detailSectionTitle}>Description</Text>
                  <Text style={styles.complaintFullDescription}>{selectedComplaint.description}</Text>
                </View>
              </ScrollView>
            )}
            
            <View style={styles.modalActions}>
              {selectedComplaint?.status === 'pending' && (
                <TouchableOpacity 
                  style={styles.investigateButton}
                  onPress={() => handleStatusUpdate(selectedComplaint.id, 'in progress')}
                >
                  <AlertTriangle color="#FFFFFF" size={16} />
                  <Text style={styles.investigateText}>Start Progress</Text>
                </TouchableOpacity>
              )}
              {selectedComplaint?.status === 'in progress' && (
                <TouchableOpacity 
                  style={styles.resolveButton}
                  onPress={() => handleStatusUpdate(selectedComplaint.id, 'resolved')}
                >
                  <CheckCircle color="#FFFFFF" size={16} />
                  <Text style={styles.resolveText}>Mark as Resolved</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: screenWidth * 0.05,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.05,
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterButtonText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
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
  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  complaintInfo: {
    flex: 1,
  },
  residentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  residentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  complaintResident: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  complaintUnit: {
    fontSize: 14,
    color: '#6B7280',
  },
  complaintContent: {
    flex: 1,
  },
  complaintTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  complaintTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  complaintDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  complaintMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  complaintMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  complaintMetaText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  complaintBadges: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: screenWidth * 0.9,
    maxHeight: '80%',
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  modalBody: {
    padding: 20,
  },
  modalResidentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  modalResidentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalResidentUnit: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  modalResidentContact: {
    fontSize: 12,
    color: '#6B7280',
  },
  complaintDetailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 14,
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
  complaintFullDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  investigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0077B6',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  investigateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  resolveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  resolveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  closeText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
  },
});