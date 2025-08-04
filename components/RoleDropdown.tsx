import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { ChevronDown, Shield, Users, UserCheck } from 'lucide-react-native';

interface Role {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

interface RoleDropdownProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

const roles: Role[] = [
  {
    id: '1',
    label: 'Administrator',
    value: 'admin',
    icon: <Shield size={20} color="#0077B6" />,
    color: '#0077B6',
  },
  {
    id: '2',
    label: 'Security',
    value: 'security',
    icon: <UserCheck size={20} color="#059669" />,
    color: '#059669',
  },
];

export default function RoleDropdown({ selectedRole, onRoleChange, disabled = false }: RoleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const selectedRoleData = roles.find(role => role.value === selectedRole) || roles[0];

  const toggleDropdown = () => {
    if (disabled) return;
    
    console.log('Dropdown toggled, isOpen:', !isOpen);
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    
    Animated.spring(animation, {
      toValue,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const selectRole = (role: Role) => {
    console.log('Role selected:', role.label, role.value);
    onRoleChange(role.value);
    setIsOpen(false);
    Animated.spring(animation, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };



  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Role</Text>
      
      <TouchableOpacity
        style={[
          styles.dropdown,
          disabled && styles.dropdownDisabled,
          isOpen && styles.dropdownOpen,
        ]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <View style={styles.selectedRole}>
          {selectedRoleData.icon}
          <Text style={[
            styles.selectedRoleText,
            disabled && styles.disabledText,
          ]}>
            {selectedRoleData.label}
          </Text>
        </View>
        <Animated.View
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }}
        >
          <ChevronDown 
            size={20} 
            color={disabled ? '#9CA3AF' : '#6B7280'} 
          />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View 
          style={[
            styles.dropdownList,
            {
              opacity: animation,
              transform: [
                {
                  scaleY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        >
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleItem,
                selectedRole === role.value && styles.selectedRoleItem,
              ]}
              onPress={() => {
                console.log('Role item pressed:', role.label);
                selectRole(role);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.roleItemContent}>
                {role.icon}
                <Text style={[
                  styles.roleItemText,
                  selectedRole === role.value && styles.selectedRoleItemText,
                ]}>
                  {role.label}
                </Text>
              </View>
              {selectedRole === role.value && (
                <View style={[styles.selectedIndicator, { backgroundColor: role.color }]} />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
    zIndex: 1000,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  dropdownDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  dropdownOpen: {
    borderColor: '#0077B6',
    borderWidth: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  selectedRole: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedRoleText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0077B6',
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 1001,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedRoleItem: {
    backgroundColor: '#F0F9FF',
  },
  roleItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleItemText: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontWeight: '500',
  },
  selectedRoleItemText: {
    color: '#0077B6',
    fontWeight: '600',
  },
  selectedIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
});