import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, Image, Dimensions, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Trash2, Users, Phone, Car, Heart, X, ArrowLeft, Building } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface Resident {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  familyMembers: number;
  vehicles: number;
  pets: number;
  status: 'active' | 'inactive';
  joinDate: string;
  avatar: string;
}

export default function Residents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'blocks' | 'floors' | 'residents'>('blocks');

  const residents: Resident[] = [
    // ==================== BLOCK 1 ====================
    // Block 1 - Floor 1
    {
      id: '1',
      name: 'Sarah Johnson',
      unit: 'B1-101A',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
      familyMembers: 3,
      vehicles: 2,
      pets: 1,
      status: 'active',
      joinDate: '2023-01-15',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: 'Michael Chen',
      unit: 'B1-101B',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 0,
      status: 'active',
      joinDate: '2023-03-22',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      unit: 'B1-102A',
      phone: '+1 (555) 456-7890',
      email: 'emma.rodriguez@email.com',
      familyMembers: 4,
      vehicles: 2,
      pets: 2,
      status: 'active',
      joinDate: '2022-11-08',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 1 - Floor 2
    {
      id: '4',
      name: 'David Thompson',
      unit: 'B1-201A',
      phone: '+1 (555) 321-9876',
      email: 'david.thompson@email.com',
      familyMembers: 1,
      vehicles: 1,
      pets: 1,
      status: 'active',
      joinDate: '2023-06-12',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      unit: 'B1-201B',
      phone: '+1 (555) 789-0123',
      email: 'lisa.anderson@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 1,
      status: 'active',
      joinDate: '2023-02-20',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 1 - Floor 3
    {
      id: '6',
      name: 'James Wilson',
      unit: 'B1-301A',
      phone: '+1 (555) 654-3210',
      email: 'james.wilson@email.com',
      familyMembers: 3,
      vehicles: 2,
      pets: 0,
      status: 'active',
      joinDate: '2023-04-10',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '7',
      name: 'Maria Garcia',
      unit: 'B1-302A',
      phone: '+1 (555) 111-2222',
      email: 'maria.garcia@email.com',
      familyMembers: 5,
      vehicles: 2,
      pets: 1,
      status: 'active',
      joinDate: '2022-12-05',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 1 - Floor 4
    {
      id: '8',
      name: 'Robert Kim',
      unit: 'B1-401A',
      phone: '+1 (555) 333-4444',
      email: 'robert.kim@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 2,
      status: 'active',
      joinDate: '2023-05-18',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    
    // ==================== BLOCK 2 ====================
    // Block 2 - Floor 1
    {
      id: '9',
      name: 'Jennifer Brown',
      unit: 'B2-101A',
      phone: '+1 (555) 555-6666',
      email: 'jennifer.brown@email.com',
      familyMembers: 1,
      vehicles: 1,
      pets: 1,
      status: 'active',
      joinDate: '2023-01-30',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '10',
      name: 'Thomas Lee',
      unit: 'B2-102A',
      phone: '+1 (555) 777-8888',
      email: 'thomas.lee@email.com',
      familyMembers: 4,
      vehicles: 3,
      pets: 0,
      status: 'active',
      joinDate: '2022-10-15',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 2 - Floor 2
    {
      id: '11',
      name: 'Amanda White',
      unit: 'B2-201A',
      phone: '+1 (555) 999-0000',
      email: 'amanda.white@email.com',
      familyMembers: 3,
      vehicles: 2,
      pets: 2,
      status: 'active',
      joinDate: '2023-03-08',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '12',
      name: 'Kevin Davis',
      unit: 'B2-202A',
      phone: '+1 (555) 121-3131',
      email: 'kevin.davis@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 1,
      status: 'active',
      joinDate: '2023-07-22',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 2 - Floor 3
    {
      id: '13',
      name: 'Sophie Martin',
      unit: 'B2-301A',
      phone: '+1 (555) 414-1515',
      email: 'sophie.martin@email.com',
      familyMembers: 1,
      vehicles: 1,
      pets: 3,
      status: 'active',
      joinDate: '2022-09-12',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    
    // ==================== BLOCK 3 ====================
    // Block 3 - Floor 1
    {
      id: '14',
      name: 'Daniel Taylor',
      unit: 'B3-101A',
      phone: '+1 (555) 616-1717',
      email: 'daniel.taylor@email.com',
      familyMembers: 4,
      vehicles: 2,
      pets: 1,
      status: 'active',
      joinDate: '2023-02-14',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '15',
      name: 'Rachel Green',
      unit: 'B3-101B',
      phone: '+1 (555) 818-1919',
      email: 'rachel.green@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 0,
      status: 'active',
      joinDate: '2023-04-25',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 3 - Floor 2
    {
      id: '16',
      name: 'Steven Clark',
      unit: 'B3-201A',
      phone: '+1 (555) 202-2121',
      email: 'steven.clark@email.com',
      familyMembers: 3,
      vehicles: 2,
      pets: 1,
      status: 'active',
      joinDate: '2022-11-30',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '17',
      name: 'Helen Rodriguez',
      unit: 'B3-202A',
      phone: '+1 (555) 222-2323',
      email: 'helen.rodriguez@email.com',
      familyMembers: 1,
      vehicles: 1,
      pets: 2,
      status: 'active',
      joinDate: '2023-06-03',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 3 - Floor 4
    {
      id: '18',
      name: 'Anthony Moore',
      unit: 'B3-401A',
      phone: '+1 (555) 424-2525',
      email: 'anthony.moore@email.com',
      familyMembers: 5,
      vehicles: 3,
      pets: 0,
      status: 'active',
      joinDate: '2023-01-08',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    
    // ==================== BLOCK 4 ====================
    // Block 4 - Floor 1
    {
      id: '19',
      name: 'Jessica Parker',
      unit: 'B4-101A',
      phone: '+1 (555) 626-2727',
      email: 'jessica.parker@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 1,
      status: 'active',
      joinDate: '2022-12-20',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '20',
      name: 'Mark Johnson',
      unit: 'B4-102A',
      phone: '+1 (555) 828-2929',
      email: 'mark.johnson@email.com',
      familyMembers: 3,
      vehicles: 2,
      pets: 1,
      status: 'active',
      joinDate: '2023-05-12',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 4 - Floor 2
    {
      id: '21',
      name: 'Nancy Williams',
      unit: 'B4-201A',
      phone: '+1 (555) 303-3131',
      email: 'nancy.williams@email.com',
      familyMembers: 1,
      vehicles: 1,
      pets: 2,
      status: 'active',
      joinDate: '2023-03-17',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '22',
      name: 'Christopher Evans',
      unit: 'B4-202A',
      phone: '+1 (555) 323-3333',
      email: 'christopher.evans@email.com',
      familyMembers: 4,
      vehicles: 2,
      pets: 0,
      status: 'active',
      joinDate: '2022-08-29',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 4 - Floor 3
    {
      id: '23',
      name: 'Laura Mitchell',
      unit: 'B4-301A',
      phone: '+1 (555) 434-3535',
      email: 'laura.mitchell@email.com',
      familyMembers: 2,
      vehicles: 1,
      pets: 1,
      status: 'active',
      joinDate: '2023-04-07',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      id: '24',
      name: 'Paul Anderson',
      unit: 'B4-302A',
      phone: '+1 (555) 545-3737',
      email: 'paul.anderson@email.com',
      familyMembers: 3,
      vehicles: 2,
      pets: 2,
      status: 'active',
      joinDate: '2023-01-25',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    // Block 4 - Floor 4
    {
      id: '25',
      name: 'Michelle Turner',
      unit: 'B4-401A',
      phone: '+1 (555) 656-3939',
      email: 'michelle.turner@email.com',
      familyMembers: 1,
      vehicles: 1,
      pets: 3,
      status: 'active',
      joinDate: '2022-10-03',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  // Extract block and floor from unit (e.g., "B1-401" -> block 1, floor 4)
  const getBlockAndFloor = (unit: string) => {
    const [blockPart, unitNumber] = unit.split('-');
    const block = parseInt(blockPart.substring(1)); // Remove 'B' and get number
    const floor = Math.floor(parseInt(unitNumber) / 100);
    return { block, floor };
  };

  // Get all blocks (1-4)
  const blocks = [1, 2, 3, 4];

  // Get residents count per block
  const getBlockResidentCount = (blockNumber: number) => {
    return residents.filter(resident => {
      const { block } = getBlockAndFloor(resident.unit);
      return block === blockNumber;
    }).length;
  };

  // Get floors for selected block
  const getFloorsInBlock = (blockNumber: number) => {
    const floorsSet = new Set<number>();
    residents.forEach(resident => {
      const { block, floor } = getBlockAndFloor(resident.unit);
      if (block === blockNumber) {
        floorsSet.add(floor);
      }
    });
    return Array.from(floorsSet).sort((a, b) => a - b);
  };

  // Get floor occupancy details
  const getFloorOccupancy = (blockNumber: number, floorNumber: number) => {
    const occupiedUnits = new Set<string>();
    residents.forEach(resident => {
      const { block, floor } = getBlockAndFloor(resident.unit);
      if (block === blockNumber && floor === floorNumber) {
        // Extract unit number (e.g., "B1-101A" -> "101")
        const unitNumber = resident.unit.split('-')[1].slice(0, 3);
        occupiedUnits.add(unitNumber);
      }
    });
    
    // Assume 6 flats per floor (101A, 101B, 102A, 102B, 103A, 103B)
    const totalFlats = 6;
    const occupiedFlats = occupiedUnits.size;
    const emptyFlats = totalFlats - occupiedFlats;
    const residentCount = residents.filter(r => {
      const { block, floor } = getBlockAndFloor(r.unit);
      return block === blockNumber && floor === floorNumber;
    }).length;
    
    return {
      totalFlats,
      occupiedFlats,
      emptyFlats,
      residentCount
    };
  };

  // Get residents for selected block and floor
  const getResidentsInBlockFloor = (blockNumber: number, floorNumber: number) => {
    return residents.filter(resident => {
      const { block, floor } = getBlockAndFloor(resident.unit);
      return block === blockNumber && floor === floorNumber && 
             (resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              resident.unit.toLowerCase().includes(searchQuery.toLowerCase()));
    });
  };

  // Navigation functions
  const selectBlock = (blockNumber: number) => {
    setSelectedBlock(blockNumber);
    setCurrentView('floors');
    setSearchQuery(''); // Reset search when changing view
  };

  const selectFloor = (floorNumber: number) => {
    setSelectedFloor(floorNumber);
    setCurrentView('residents');
  };

  const goBackToBlocks = () => {
    setSelectedBlock(null);
    setSelectedFloor(null);
    setCurrentView('blocks');
    setSearchQuery('');
  };

  const goBackToFloors = () => {
    setSelectedFloor(null);
    setCurrentView('floors');
    setSearchQuery('');
  };

  const openResidentDetail = (resident: Resident) => {
    setSelectedResident(resident);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedResident(null);
  };

  const handleCallResident = (phoneNumber: string) => {
    // Direct redirect to phone dialer with number
    Linking.openURL(`tel:${phoneNumber}`).catch((err) => {
      Alert.alert('Error', 'Unable to make phone call. Please check if your device supports phone calls.');
      console.error('Failed to open phone dialer:', err);
    });
  };

  const renderHeader = () => {
    let title = 'Residents';
    if (currentView === 'floors' && selectedBlock) {
      title = `Block ${selectedBlock}`;
    } else if (currentView === 'residents' && selectedBlock && selectedFloor) {
      title = `Block ${selectedBlock} - Floor ${selectedFloor}`;
    }

    return (
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          {currentView !== 'blocks' && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={currentView === 'floors' ? goBackToBlocks : goBackToFloors}
            >
              <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus color="#FFFFFF" size={24} />
          </TouchableOpacity>
        </View>
        
        {currentView === 'residents' && (
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Search color="#6B7280" size={20} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search residents..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>
        )}
      </LinearGradient>
    );
  };

  const renderBlocksView = () => (
    <ScrollView style={styles.content}>
      <View style={styles.blocksGrid}>
        {blocks.map((blockNumber) => (
          <TouchableOpacity
            key={blockNumber}
            style={styles.blockCard}
            onPress={() => selectBlock(blockNumber)}
          >
            <Building color="#0077B6" size={48} />
            <Text style={styles.blockTitle}>Block {blockNumber}</Text>
            <Text style={styles.blockSubtitle}>
              {getBlockResidentCount(blockNumber)} Residents
            </Text>
            <Text style={styles.blockFloors}>4 Floors</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderFloorsView = () => {
    if (!selectedBlock) return null;
    const floors = getFloorsInBlock(selectedBlock);
    
    return (
      <ScrollView style={styles.content}>
        <View style={styles.floorsGrid}>
          {[1, 2, 3, 4].map((floorNumber) => {
            const hasResidents = floors.includes(floorNumber);
            const occupancy = getFloorOccupancy(selectedBlock, floorNumber);

            return (
              <TouchableOpacity
                key={floorNumber}
                style={[styles.floorCard, !hasResidents && styles.floorCardEmpty]}
                onPress={() => hasResidents && selectFloor(floorNumber)}
                disabled={!hasResidents}
              >
                <Text style={[styles.floorNumber, !hasResidents && styles.floorNumberEmpty]}>
                  {floorNumber}
                </Text>
                <Text style={[styles.floorTitle, !hasResidents && styles.floorTitleEmpty]}>
                  {floorNumber === 1 ? '1st Floor' : 
                   floorNumber === 2 ? '2nd Floor' : 
                   floorNumber === 3 ? '3rd Floor' : 
                   `${floorNumber}th Floor`}
                </Text>
                
                {hasResidents ? (
                  <View style={styles.occupancyInfo}>
                    <Text style={styles.floorSubtitle}>
                      {occupancy.residentCount} Residents
                    </Text>
                    <Text style={styles.floorOccupancy}>
                      {occupancy.occupiedFlats} Occupied • {occupancy.emptyFlats} Empty
                    </Text>
                    <Text style={styles.floorTotal}>
                      {occupancy.totalFlats} Total Flats
                    </Text>
                  </View>
                ) : (
                  <View style={styles.occupancyInfo}>
                    <Text style={styles.floorSubtitleEmpty}>No Residents</Text>
                    <Text style={styles.floorOccupancyEmpty}>
                      0 Occupied • 6 Empty
                    </Text>
                    <Text style={styles.floorTotalEmpty}>
                      6 Total Flats
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderResidentsView = () => {
    if (!selectedBlock || !selectedFloor) return null;
    const residentsInFloor = getResidentsInBlockFloor(selectedBlock, selectedFloor);
    
    return (
      <ScrollView style={styles.content}>
        {residentsInFloor.map((resident) => (
          <TouchableOpacity 
            key={resident.id} 
            style={styles.residentCard}
            onPress={() => openResidentDetail(resident)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.residentInfo}>
                <Image source={{ uri: resident.avatar }} style={styles.avatar} />
                <View style={styles.residentDetails}>
                  <Text style={styles.residentName}>{resident.name}</Text>
                  <Text style={styles.residentUnit}>Unit {resident.unit}</Text>
                  <Text style={styles.residentPhone}>{resident.phone}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.cardDetails}>
              <View style={styles.detailItem}>
                <Users color="#0077B6" size={16} />
                <Text style={styles.detailText}>{resident.familyMembers} Family</Text>
              </View>
              <View style={styles.detailItem}>
                <Car color="#0077B6" size={16} />
                <Text style={styles.detailText}>{resident.vehicles} Vehicles</Text>
              </View>
              <View style={styles.detailItem}>
                <Heart color="#0077B6" size={16} />
                <Text style={styles.detailText}>{resident.pets} Pets</Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.deleteButton}>
                <Trash2 color="#EF4444" size={16} />
                <Text style={styles.deleteText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        
        {residentsInFloor.length === 0 && (
          <View style={styles.emptyState}>
            <Users color="#9CA3AF" size={48} />
            <Text style={styles.emptyStateText}>No residents found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search criteria' : 'This floor has no residents'}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {currentView === 'blocks' && renderBlocksView()}
      {currentView === 'floors' && renderFloorsView()}
      {currentView === 'residents' && renderResidentsView()}

      {/* Resident Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Resident Details</Text>
              <TouchableOpacity onPress={closeModal}>
                <X color="#6B7280" size={24} />
              </TouchableOpacity>
            </View>
            
            {selectedResident && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.profileSection}>
                  <Image source={{ uri: selectedResident.avatar }} style={styles.modalAvatar} />
                  <Text style={styles.modalName}>{selectedResident.name}</Text>
                  <Text style={styles.modalUnit}>Unit {selectedResident.unit}</Text>
                  
                  {/* Call Button positioned right after profile */}
                  <View style={styles.profileCallAction}>
                    <TouchableOpacity 
                      style={styles.callButton}
                      onPress={() => handleCallResident(selectedResident.phone)}
                      activeOpacity={0.7}
                    >
                      <Phone color="#FFFFFF" size={18} />
                      <Text style={styles.callButtonText}>Call Resident</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedResident.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedResident.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Join Date:</Text>
                    <Text style={styles.detailValue}>{selectedResident.joinDate}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Household Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Family Members:</Text>
                    <Text style={styles.detailValue}>{selectedResident.familyMembers}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vehicles:</Text>
                    <Text style={styles.detailValue}>{selectedResident.vehicles}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Pets:</Text>
                    <Text style={styles.detailValue}>{selectedResident.pets}</Text>
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
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: screenWidth * 0.05, // 5% of screen width
  },
  
  // Blocks Grid Styles
  blocksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  blockCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 4,
  },
  blockSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  blockFloors: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Floors Grid Styles
  floorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  floorCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floorCardEmpty: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  floorNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 8,
  },
  floorNumberEmpty: {
    color: '#9CA3AF',
  },
  floorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  floorTitleEmpty: {
    color: '#9CA3AF',
  },
  floorSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  floorSubtitleEmpty: {
    color: '#9CA3AF',
    marginBottom: 4,
  },
  occupancyInfo: {
    alignItems: 'center',
  },
  floorOccupancy: {
    fontSize: 12,
    color: '#0077B6',
    fontWeight: '500',
    marginBottom: 2,
  },
  floorOccupancyEmpty: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 2,
  },
  floorTotal: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  floorTotalEmpty: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  residentCard: {
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
  residentInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  residentDetails: {
    flex: 1,
  },
  residentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  residentUnit: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
    marginBottom: 2,
  },
  residentPhone: {
    fontSize: 14,
    color: '#6B7280',
  },

  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  deleteText: {
    color: '#EF4444',
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileCallAction: {
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
  modalUnit: {
    fontSize: 16,
    color: '#0077B6',
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
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

  callButton: {
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
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Keep the old styles for backward compatibility if needed elsewhere
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#0077B6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});