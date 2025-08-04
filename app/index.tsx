import { useEffect } from 'react';
import { View, ActivityIndicator, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Navigate based on user role
        switch (user.role) {
          case 'admin':
            router.replace('/(drawer)');
            break;
          case 'security':
            router.replace('/(security)');
            break;
          default:
            router.replace('/(drawer)');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, user]);

  // Show loading screen while checking authentication
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0077B6' }}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </SafeAreaView>
  );
}