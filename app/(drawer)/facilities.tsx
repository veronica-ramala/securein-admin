import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, SafeAreaView, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, Users, CircleCheck as CheckCircle, Circle as XCircle, X, MapPin } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Booking {
  id: string;
  facilityName: string;
  residentName: string;
  unit: string;
  date: string;
  time: string;
  duration: string;
  status: 'pending' | 'approved' | 'declined';
  purpose: string;
  attendees: number;
  residentAvatar: string;
}

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  availability: 'available' | 'booked' | 'maintenance';
  nextBooking?: string;
  image: string;
}

export default function Facilities() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const bookings: Booking[] = [
    {
      id: '4',
      facilityName: 'Function Hall',
      residentName: 'David Thompson',
      unit: 'A-301',
      date: '2024-01-28',
      time: '7:00 PM',
      duration: '4 hours',
      status: 'declined',
      purpose: 'Family gathering',
      attendees: 25,
      residentAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const facilities: Facility[] = [
    {
      id: '3',
      name: 'Function Hall',
      type: 'Events',
      capacity: 50,
      availability: 'available',
      image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
    },
    {
      id: '5',
      name: 'Tennis Court',
      type: 'Sports',
      capacity: 4,
      availability: 'available',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'approved': return '#10B981';
      case 'declined': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return '#10B981';
      case 'booked': return '#F59E0B';
      case 'maintenance': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const openBookingDetail = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedBooking(null);
  };

  const handleApprove = (bookingId: string) => {
    console.log('Approving booking:', bookingId);
    closeModal();
  };

  const handleDecline = (bookingId: string) => {
    console.log('Declining booking:', bookingId);
    closeModal();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Facilities</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookings.filter(b => b.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{facilities.filter(f => f.availability === 'available').length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookings.filter(b => b.status === 'approved').length}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>

        {/* Facility Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facility Status</Text>
          {facilities.map((facility) => (
            <View key={facility.id} style={styles.facilityCard}>
              <Image source={{ uri: facility.image }} style={styles.facilityImage} />
              <View style={styles.facilityContent}>
                <View style={styles.facilityHeader}>
                  <View style={styles.facilityInfo}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <Text style={styles.facilityType}>{facility.type} • Capacity: {facility.capacity}</Text>
                  </View>
                  <View style={[
                    styles.availabilityBadge,
                    { backgroundColor: getAvailabilityColor(facility.availability) }
                  ]}>
                    <Text style={styles.availabilityText}>
                      {facility.availability.toUpperCase()}
                    </Text>
                  </View>
                </View>
                {facility.nextBooking && (
                  <View style={styles.nextBooking}>
                    <Clock color="#6B7280" size={16} />
                    <Text style={styles.nextBookingText}>Next: {facility.nextBooking}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Booking Requests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Requests</Text>
          {bookings.map((booking) => (
            <TouchableOpacity 
              key={booking.id} 
              style={styles.bookingCard}
              onPress={() => openBookingDetail(booking)}
            >
              <View style={styles.bookingHeader}>
                <View style={styles.bookingInfo}>
                  <View style={styles.residentInfo}>
                    <Image source={{ uri: booking.residentAvatar }} style={styles.residentAvatar} />
                    <View>
                      <Text style={styles.bookingFacility}>{booking.facilityName}</Text>
                      <Text style={styles.bookingResident}>{booking.residentName} - {booking.unit}</Text>
                    </View>
                  </View>
                  <View style={styles.bookingDetails}>
                    <View style={styles.bookingDetail}>
                      <Calendar color="#6B7280" size={14} />
                      <Text style={styles.bookingDetailText}>{booking.date}</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <Clock color="#6B7280" size={14} />
                      <Text style={styles.bookingDetailText}>{booking.time}</Text>
                    </View>
                    <View style={styles.bookingDetail}>
                      <Users color="#6B7280" size={14} />
                      <Text style={styles.bookingDetailText}>{booking.attendees} people</Text>
                    </View>
                  </View>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) }
                ]}>
                  <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
                </View>
              </View>
              
              {booking.status === 'pending' && (
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleApprove(booking.id)}
                  >
                    <CheckCircle color="#FFFFFF" size={16} />
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.declineButton}
                    onPress={() => handleDecline(booking.id)}
                  >
                    <XCircle color="#FFFFFF" size={16} />
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Booking Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            {selectedBooking && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalResidentInfo}>
                  <Image source={{ uri: selectedBooking.residentAvatar }} style={styles.modalAvatar} />
                  <View>
                    <Text style={styles.modalResidentName}>{selectedBooking.residentName}</Text>
                    <Text style={styles.modalResidentUnit}>Unit {selectedBooking.unit}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Facility Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Facility:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.facilityName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.duration}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Attendees:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.attendees} people</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purpose:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.purpose}</Text>
                  </View>
                </View>
                
                {selectedBooking.status === 'pending' && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.primaryButton}
                      onPress={() => handleApprove(selectedBooking.id)}
                    >
                      <CheckCircle color="#FFFFFF" size={16} />
                      <Text style={styles.primaryButtonText}>Approve Booking</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.dangerButton}
                      onPress={() => handleDecline(selectedBooking.id)}
                    >
                      <XCircle color="#FFFFFF" size={16} />
                      <Text style={styles.dangerButtonText}>Decline Booking</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
    paddingHorizontal: 20,
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
  calendarButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
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
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  facilityImage: {
    width: '100%',
    height: 120,
  },
  facilityContent: {
    padding: 16,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  facilityType: {
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nextBooking: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  nextBookingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingInfo: {
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
  bookingFacility: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  bookingResident: {
    fontSize: 14,
    color: '#0077B6',
    fontWeight: '600',
  },
  bookingDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  bookingDetailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
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
  quickActions: {
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
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  declineText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
  modalResidentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  modalResidentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  modalResidentUnit: {
    fontSize: 14,
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
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});