import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { catsApi, swipesApi } from '../../services/api';
import type { Cat } from '../../types';
import SwipeableCardSimple from '../../components/SwipeableCardSimple';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [myCatId, setMyCatId] = useState<string>('');

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    try {
      setIsLoading(true);
      const response = await catsApi.getFeed({ limit: 20 });

      if (response.cats.length === 0) {
        Alert.alert(
          'No cats available',
          response.message || 'No more cats to show. Check back later!',
          [{ text: 'OK' }]
        );
      }

      setCats(response.cats);
      setMyCatId(response.myCatId);
      setCurrentIndex(0);
    } catch (error: any) {
      console.error('Error loading cats:', error);
      Alert.alert('Error', 'Failed to load cats. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (action: 'like' | 'pass') => {
    const currentCat = cats[currentIndex];
    if (!currentCat || !myCatId) return;

    setIsSwiping(true);
    try {
      const response = await swipesApi.createSwipe({
        swiperCatId: myCatId,
        targetCatId: currentCat._id,
        action,
      });

      if (response.match.matched) {
        Alert.alert(
          '❤️ It\'s a Match!',
          `You matched with ${currentCat.name}!`,
          [
            { text: 'Keep Swiping', style: 'cancel' },
            {
              text: 'View Match', onPress: () => {
                // TODO: Navigate to matches
              }
            }
          ]
        );
      }

      // Move to next cat
      if (currentIndex < cats.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // No more cats, reload
        Alert.alert(
          'No more cats!',
          'That\'s all for now. Loading more...',
          [{ text: 'OK', onPress: loadCats }]
        );
      }
    } catch (error: any) {
      console.error('Swipe error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to swipe';
      Alert.alert('Error', errorMsg);
    } finally {
      setIsSwiping(false);
    }
  };

  const currentCat = cats[currentIndex];

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={{ color: '#6b7280', marginTop: 16 }}>Loading cats...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      {/* Header */}
      <View style={{
        paddingTop: 52,
        paddingBottom: 20,
        paddingHorizontal: 24,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="paw" size={36} color="#ec4899" />
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#1f2937' }}>Meowmatch</Text>
          </View>
          <TouchableOpacity
            onPress={loadCats}
            style={{
              backgroundColor: '#fef2f2',
              padding: 10,
              borderRadius: 12,
            }}
          >
            <Ionicons name="refresh" size={22} color="#ec4899" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Card Area */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        {currentCat ? (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <SwipeableCardSimple
              cat={currentCat}
              onSwipeLeft={() => handleSwipe('pass')}
              onSwipeRight={() => handleSwipe('like')}
            />


          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="paw" size={80} color="#d1d5db" />
            <Text style={{ color: '#9ca3af', marginTop: 16, fontSize: 18 }}>No more cats to show</Text>
            <Text style={{ color: '#9ca3af', fontSize: 14 }}>Check back later!</Text>
            <TouchableOpacity
              style={{ marginTop: 16, backgroundColor: '#ec4899', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 }}
              onPress={loadCats}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Reload</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      {currentCat && (
        <View style={{ paddingBottom: 24, paddingHorizontal: 12, backgroundColor: '#ffffff' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24, paddingTop: 12 }}>
            {/* Pass Button */}
            <TouchableOpacity
              style={{
                width: 54,
                height: 54,
                backgroundColor: '#ffffff',
                borderWidth: 2,
                borderColor: '#ef4444',
                borderRadius: 27,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 3
              }}
              onPress={() => handleSwipe('pass')}
              disabled={isSwiping}
            >
              <Ionicons name="close" size={26} color="#ef4444" />
            </TouchableOpacity>

            {/* Like Button */}
            <TouchableOpacity
              style={{
                width: 54,
                height: 54,
                backgroundColor: '#ec4899',
                borderRadius: 32,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#ec4899',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6
              }}
              onPress={() => handleSwipe('like')}
              disabled={isSwiping}
            >
              <Ionicons name="heart" size={32} color="#ffffff" />
            </TouchableOpacity>

          </View>
        </View>
      )}
    </View>
  );
}
