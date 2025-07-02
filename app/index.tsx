import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(drawer)');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking authentication
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0077B6' }}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}