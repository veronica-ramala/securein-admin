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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      const result = await login(username.trim(), password);
      if (result.success) {
        router.replace('/(drawer)');
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

  const fillDefaultCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0077B6', '#00B4D8', '#90CAF9']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.content}>
            {/* Logo/Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Lock color="#FFFFFF" size={60} />
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

              <View style={[styles.inputContainer, errors.username && styles.inputError]}>
                <User color="#0077B6" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#6B7280"
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
                  placeholderTextColor="#6B7280"
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
                    <EyeOff color="#6B7280" size={20} />
                  ) : (
                    <Eye color="#6B7280" size={20} />
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

              {/* Demo Credentials Button */}
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
              <Text style={styles.footerText}>
                SecureIN Admin v1.0.0
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: '#0077B6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0077B6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    marginTop: 12,
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
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
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