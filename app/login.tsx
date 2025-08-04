import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import RoleDropdown from '@/components/RoleDropdown';
import LoginSuccessAnimation from '@/components/LoginSuccessAnimation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [errors, setErrors] = useState<{username?: string; password?: string; general?: string}>({});
  const { login, user } = useAuth();

  const validateInputs = (): boolean => {
    const newErrors: {username?: string; password?: string} = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setErrors({});

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username.trim(), password, selectedRole);
      
      if (result.success) {
        setShowSuccessAnimation(true);
      } else {
        setErrors({ general: result.error || 'Login failed. Please check your credentials.' });
      }
    } catch (error) {
      setErrors({ 
        general: error instanceof Error 
          ? `Login error: ${error.message}` 
          : 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    setShowSuccessAnimation(false);
    
    // Navigate based on role
    switch (selectedRole) {
      case 'admin':
        router.replace('/(drawer)' as any);
        break;
      case 'security':
        router.replace('/(security)' as any);
        break;
      default:
        router.replace('/(drawer)' as any);
    }
  };

  const fillDefaultCredentials = () => {
    if (selectedRole === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (selectedRole === 'security') {
      setUsername('security');
      setPassword('security123');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Lock color="#0077B6" size={40} />
            </View>
            <Text style={styles.title}>SecureIN Admin</Text>
            <Text style={styles.subtitle}>Property Management System</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            {/* General Error */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {/* Role Selection */}
            <RoleDropdown
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              disabled={isLoading}
            />

            <View style={[styles.inputContainer, errors.username && styles.inputError]}>
              <User color="#0077B6" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) {
                    setErrors(prev => ({ ...prev, username: undefined }));
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {errors.username && (
              <Text style={styles.fieldErrorText}>{errors.username}</Text>
            )}

            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Lock color="#0077B6" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff color="#9CA3AF" size={20} />
                ) : (
                  <Eye color="#9CA3AF" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.fieldErrorText}>{errors.password}</Text>
            )}

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.demoButton}
              onPress={fillDefaultCredentials}
              disabled={isLoading}
            >
              <Text style={styles.demoButtonText}>Use Demo Credentials</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SecureIN Admin v1.0.0</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Success Animation Overlay */}
      <LoginSuccessAnimation
        visible={showSuccessAnimation}
        userRole={selectedRole}
        onAnimationComplete={handleAnimationComplete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#0077B6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  demoButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  fieldErrorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 8,
    marginLeft: 4,
  },
});