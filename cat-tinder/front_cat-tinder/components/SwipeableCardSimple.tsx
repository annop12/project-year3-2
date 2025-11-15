import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Cat } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;
const ROTATION_ANGLE = 60;

interface SwipeableCardProps {
  cat: Cat;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeableCardSimple({ cat, onSwipeLeft, onSwipeRight }: SwipeableCardProps) {
  const position = React.useRef(new Animated.ValueXY()).current;
  const likeOpacity = React.useRef(new Animated.Value(0)).current;
  const nopeOpacity = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });

        // Update overlays opacity
        if (gestureState.dx > 0) {
          likeOpacity.setValue(gestureState.dx / SWIPE_THRESHOLD);
          nopeOpacity.setValue(0);
        } else {
          nopeOpacity.setValue(Math.abs(gestureState.dx) / SWIPE_THRESHOLD);
          likeOpacity.setValue(0);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swipe Right - Like
          Animated.timing(position, {
            toValue: { x: SCREEN_WIDTH * 1.5, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onSwipeRight();
            resetPosition();
          });
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swipe Left - Pass
          Animated.timing(position, {
            toValue: { x: -SCREEN_WIDTH * 1.5, y: gestureState.dy },
            duration: 250,
            useNativeDriver: false,
          }).start(() => {
            onSwipeLeft();
            resetPosition();
          });
        } else {
          // Return to center
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    Animated.timing(likeOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    Animated.timing(nopeOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [`-${ROTATION_ANGLE}deg`, '0deg', `${ROTATION_ANGLE}deg`],
  });

  const animatedCardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  const ownerName = typeof cat.ownerId === 'object' ? cat.ownerId.displayName : 'Unknown';
  const ownerAvatar = typeof cat.ownerId === 'object' ? cat.ownerId.avatarUrl : undefined;

  return (
    <Animated.View
      style={[styles.card, animatedCardStyle]}
      {...panResponder.panHandlers}
    >
      {/* NOPE Overlay */}
      <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
        <View style={styles.overlayBadge}>
          <Ionicons name="close-circle" size={70} color="#ef4444" />
          <Text style={styles.nopeText}>NOPE</Text>
        </View>
      </Animated.View>

      {/* LIKE Overlay */}
      <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
        <View style={styles.overlayBadge}>
          <Ionicons name="heart-circle" size={70} color="#ec4899" />
          <Text style={styles.likeText}>LIKE</Text>
        </View>
      </Animated.View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        {/* Hot Badge */}
        <View style={styles.hotBadge}>
          <Text style={styles.hotEmoji}>🔥</Text>
        </View>

        {cat.photos?.length > 0 ? (
          <Image
            source={{ uri: cat.photos[0].url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Ionicons name="image-outline" size={80} color="#d1d5db" />
            <Text style={styles.noImageText}>No photo available</Text>
          </View>
        )}
      </View>

      {/* Info Section - White Background */}
      <View style={styles.infoContainer}>
        {/* Name */}
        <Text style={styles.name}>{cat.name}</Text>



        {/* Owner Info */}
        <View style={styles.ownerRow}>
          <View style={styles.ownerAvatar}>
            {ownerAvatar ? (
              <Image source={{ uri: ownerAvatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person-circle" size={36} color="#d1d5db" />
            )}
          </View>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerName}>{ownerName}</Text>
            {cat.location && (
              <Text style={styles.ownerLocation}>{cat.location.province}</Text>
            )}
          </View>
        </View>

        {/* Description Label */}
        <Text style={styles.descriptionLabel}>Description</Text>

        {/* Details */}
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>
            {cat.breed || 'Mixed'} • {cat.gender === 'male' ? 'Male' : 'Female'} • {Math.floor(cat.ageMonths / 12)}y {cat.ageMonths % 12}m
          </Text>
        </View>

        {/* Purpose Tags */}
        {cat.purpose && cat.purpose.length > 0 && (
          <View style={styles.purposeContainer}>
            {cat.purpose.map((p) => (
              <View key={p} style={styles.purposeTag}>
                <Text style={styles.purposeText}>
                  {p === 'mate' ? 'Breeding' : p === 'friend' ? 'Friend' : 'Foster'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* View More Button */}
        <View style={styles.viewMoreButton}>
          <Text style={styles.viewMoreText}>View More</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 380,
    height: SCREEN_HEIGHT * 0.68,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  nopeOverlay: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  likeOverlay: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
  },
  overlayBadge: {
    alignItems: 'center',
    transform: [{ rotate: '-20deg' }],
  },
  nopeText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ef4444',
    marginTop: 8,
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  likeText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ec4899',
    marginTop: 8,
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  imageContainer: {
    height: '58%',
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  noImageText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 14,
  },
  hotBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 5,
  },
  hotEmoji: {
    fontSize: 22,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 18,
    paddingTop: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  avatarImage: {
    width: 40,
    height: 40,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  ownerLocation: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  detailsRow: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  purposeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  purposeTag: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  purposeText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  viewMoreButton: {
    backgroundColor: '#ec4899',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  viewMoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
