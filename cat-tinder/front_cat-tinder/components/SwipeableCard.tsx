import React, { forwardRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import type { Cat } from "../types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // 30% of screen width
const ROTATION_ANGLE = 60; // degrees

interface SwipeableCardProps {
  cat: Cat;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export interface SwipeableCardRef {
  swipeLeft: () => void;
  swipeRight: () => void;
}

const SwipeableCard = forwardRef<SwipeableCardRef, SwipeableCardProps>(
  ({ cat, onSwipeLeft, onSwipeRight }, ref) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Expose swipe methods to parent
    useImperativeHandle(ref, () => ({
      swipeLeft: () => {
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onSwipeLeft)();
        });
      },
      swipeRight: () => {
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
          runOnJS(onSwipeRight)();
        });
      },
    }));

    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
      })
      .onEnd((event) => {
        // Swipe Right (Like)
        if (event.translationX > SWIPE_THRESHOLD) {
          translateX.value = withSpring(SCREEN_WIDTH * 1.5, {}, () => {
            runOnJS(onSwipeRight)();
          });
        }
        // Swipe Left (Pass)
        else if (event.translationX < -SWIPE_THRESHOLD) {
          translateX.value = withSpring(-SCREEN_WIDTH * 1.5, {}, () => {
            runOnJS(onSwipeLeft)();
          });
        }
        // Return to center
        else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      });

    const animatedCardStyle = useAnimatedStyle(() => {
      const rotation = interpolate(
        translateX.value,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
        Extrapolate.CLAMP,
      );

      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotateZ: `${rotation}deg` },
        ],
      };
    });

    const animatedLikeStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD],
        [0, 0.5, 1],
        Extrapolate.CLAMP,
      );

      return { opacity };
    });

    const animatedNopeStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD / 2, 0],
        [1, 0.5, 0],
        Extrapolate.CLAMP,
      );

      return { opacity };
    });

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          {/* NOPE Overlay (Left) */}
          <Animated.View
            style={[styles.overlay, styles.nopeOverlay, animatedNopeStyle]}
          >
            <View style={styles.overlayBadge}>
              <Ionicons name="close-circle" size={60} color="#ef4444" />
              <Text style={styles.nopeText}>NOPE</Text>
            </View>
          </Animated.View>

          {/* LIKE Overlay (Right) */}
          <Animated.View
            style={[styles.overlay, styles.likeOverlay, animatedLikeStyle]}
          >
            <View style={styles.overlayBadge}>
              <Ionicons name="heart-circle" size={60} color="#ec4899" />
              <Text style={styles.likeText}>LIKE</Text>
            </View>
          </Animated.View>

          {/* Card Content */}
          <View style={styles.imageContainer}>
            {cat.photos?.length > 0 ? (
              <Image
                source={{ uri: cat.photos[0].url }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.noImageContainer}>
                <Ionicons name="image-outline" size={80} color="#d1d5db" />
                <Text style={styles.noImageText}>No photo</Text>
              </View>
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.name}>{cat.name}</Text>
              <View style={styles.genderBadge}>
                <Ionicons
                  name={cat.gender === "male" ? "male" : "female"}
                  size={16}
                  color="#db2777"
                />
                <Text style={styles.genderText}>
                  {cat.gender === "male" ? "Male" : "Female"}
                </Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>
                  {Math.floor(cat.ageMonths / 12)} years {cat.ageMonths % 12}{" "}
                  months
                </Text>
              </View>

              {cat.breed && (
                <View style={styles.detailRow}>
                  <Ionicons name="paw-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{cat.breed}</Text>
                </View>
              )}

              {cat.location && (
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {cat.location.district}, {cat.location.province}
                  </Text>
                </View>
              )}

              {typeof cat.ownerId === "object" && cat.ownerId && (
                <View style={styles.detailRow}>
                  <Ionicons name="person-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>
                    Owner: {cat.ownerId.displayName}
                  </Text>
                </View>
              )}
            </View>

            {/* Purpose Tags */}
            {cat.purpose && cat.purpose.length > 0 && (
              <View style={styles.tagsContainer}>
                {cat.purpose.map((p) => (
                  <View key={p} style={styles.tag}>
                    <Text style={styles.tagText}>{p}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

SwipeableCard.displayName = "SwipeableCard";

export default SwipeableCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 400,
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  nopeOverlay: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  likeOverlay: {
    backgroundColor: "rgba(236, 72, 153, 0.1)",
  },
  overlayBadge: {
    alignItems: "center",
    transform: [{ rotate: "-15deg" }],
  },
  nopeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ef4444",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  likeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ec4899",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  imageContainer: {
    height: "60%",
    backgroundColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#9ca3af",
    marginTop: 8,
  },
  infoContainer: {
    padding: 24,
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  genderBadge: {
    backgroundColor: "#fce7f3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  genderText: {
    color: "#db2777",
    fontWeight: "600",
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    color: "#6b7280",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {
    color: "#6b46c1",
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
