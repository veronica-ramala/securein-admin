import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Shield, Users, UserCheck, Sparkles, Star } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LoginSuccessAnimationProps {
  visible: boolean;
  userRole: string;
  onAnimationComplete: () => void;
}

export default function LoginSuccessAnimation({ 
  visible, 
  userRole, 
  onAnimationComplete 
}: LoginSuccessAnimationProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkScaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset all animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      checkScaleAnim.setValue(0);
      slideAnim.setValue(100);
      sparkleAnim.setValue(0);
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);

      // Start the animation sequence
      Animated.sequence([
        // 1. Fade in background quickly
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        // 2. Scale up main container with bounce
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        // 3. Pop in check icon
        Animated.spring(checkScaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        // 4. Slide up text content
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start continuous animations
        Animated.parallel([
          // Sparkle animation
          Animated.loop(
            Animated.sequence([
              Animated.timing(sparkleAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(sparkleAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 3 }
          ),
          // Pulse animation
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 750,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 750,
                useNativeDriver: true,
              }),
            ]),
            { iterations: 2 }
          ),
          // Rotation animation
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Wait exactly 3 seconds then fade out
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onAnimationComplete();
            });
          }, 3000);
        });
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'security':
        return 'Security Officer';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#0077B6';
      case 'security':
        return '#059669';
      default:
        return '#0077B6';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield color="#FFFFFF" size={40} />;
      case 'security':
        return <UserCheck color="#FFFFFF" size={40} />;
      default:
        return <Shield color="#FFFFFF" size={40} />;
    }
  };

  const roleColor = getRoleColor(userRole);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        }
      ]}
    >
      <LinearGradient
        colors={[
          `${roleColor}F0`,
          `${roleColor}E0`,
          `${roleColor}D0`
        ]}
        style={styles.gradient}
      >
        {/* Animated Background Circles */}
        <Animated.View 
          style={[
            styles.backgroundCircle1,
            {
              transform: [
                { scale: pulseAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.backgroundCircle2,
            {
              transform: [
                { scale: pulseAnim },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['360deg', '0deg'],
                  }),
                },
              ],
            }
          ]}
        />

        <Animated.View 
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Floating Sparkles */}
          <Animated.View 
            style={[
              styles.sparkleContainer,
              {
                opacity: sparkleAnim,
              }
            ]}
          >
            <Animated.View 
              style={[
                styles.sparkle1,
                {
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '180deg'],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Star color="#FFFFFF" size={20} />
            </Animated.View>
            <Animated.View 
              style={[
                styles.sparkle2,
                {
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['180deg', '360deg'],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Sparkles color="#FFFFFF" size={16} />
            </Animated.View>
            <Animated.View 
              style={[
                styles.sparkle3,
                {
                  transform: [
                    {
                      rotate: sparkleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-180deg'],
                      }),
                    },
                  ],
                }
              ]}
            >
              <Star color="#FFFFFF" size={18} />
            </Animated.View>
          </Animated.View>

          {/* Main Success Icon */}
          <Animated.View 
            style={[
              styles.mainIconContainer,
              {
                transform: [{ scale: checkScaleAnim }],
                backgroundColor: roleColor,
              }
            ]}
          >
            <View style={styles.iconWrapper}>
              <CheckCircle color="#FFFFFF" size={60} />
            </View>
          </Animated.View>

          {/* Role Icon */}
          <Animated.View 
            style={[
              styles.roleIconContainer,
              {
                transform: [{ scale: checkScaleAnim }],
              }
            ]}
          >
            {getRoleIcon(userRole)}
          </Animated.View>

          {/* Success Text */}
          <Animated.View 
            style={[
              styles.textContainer,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.successTitle}>✨ Login Successful! ✨</Text>
            <Text style={styles.welcomeText}>
              Welcome back!
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: roleColor }]}>
              <Text style={styles.roleText}>{getRoleDisplayName(userRole)}</Text>
            </View>
          </Animated.View>

          {/* Loading indicator */}
          <Animated.View 
            style={[
              styles.loadingContainer,
              {
                opacity: sparkleAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <Text style={styles.loadingText}>🚀 Redirecting to your dashboard...</Text>
            <View style={styles.loadingDots}>
              <Animated.View 
                style={[
                  styles.dot,
                  {
                    opacity: sparkleAnim,
                  }
                ]}
              />
              <Animated.View 
                style={[
                  styles.dot,
                  {
                    opacity: sparkleAnim,
                  }
                ]}
              />
              <Animated.View 
                style={[
                  styles.dot,
                  {
                    opacity: sparkleAnim,
                  }
                ]}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle1: {
    position: 'absolute',
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: screenWidth * 0.75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -screenWidth * 0.5,
    left: -screenWidth * 0.25,
  },
  backgroundCircle2: {
    position: 'absolute',
    width: screenWidth * 1.2,
    height: screenWidth * 1.2,
    borderRadius: screenWidth * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -screenWidth * 0.4,
    right: -screenWidth * 0.2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  sparkleContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    zIndex: 5,
  },
  sparkle1: {
    position: 'absolute',
    top: 30,
    right: 50,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 60,
    left: 40,
  },
  sparkle3: {
    position: 'absolute',
    top: 100,
    left: 60,
  },
  mainIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  iconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 10,
  },
  roleIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 15,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  roleBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 15,
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 4,
  },
});