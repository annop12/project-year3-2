import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { matchesApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Match, Cat, Owner } from '../../types';

export default function MatchesScreen() {
  const router = useRouter();
  const { ownerId } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await matchesApi.getMatches({ limit: 50 });
      setMatches(response.matches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadMatches();
  };

  const openChat = (matchId: string) => {
    router.push(`/chat/${matchId}`);
  };

  const getOtherCat = (match: Match): Cat | null => {
    // Check which owner is us, then return the other cat
    const ownerAId = typeof match.ownerAId === 'object' ? match.ownerAId._id : match.ownerAId;
    const ownerBId = typeof match.ownerBId === 'object' ? match.ownerBId._id : match.ownerBId;

    if (ownerAId === ownerId) {
      return typeof match.catBId === 'object' ? match.catBId : null;
    } else {
      return typeof match.catAId === 'object' ? match.catAId : null;
    }
  };

  const getOtherOwner = (match: Match): Owner | null => {
    const ownerAId = typeof match.ownerAId === 'object' ? match.ownerAId._id : match.ownerAId;
    const ownerBId = typeof match.ownerBId === 'object' ? match.ownerBId._id : match.ownerBId;

    if (ownerAId === ownerId) {
      return typeof match.ownerBId === 'object' ? match.ownerBId : null;
    } else {
      return typeof match.ownerAId === 'object' ? match.ownerAId : null;
    }
  };

  const renderMatch = ({ item }: { item: Match }) => {
    const otherCat = getOtherCat(item);
    const otherOwner = getOtherOwner(item);

    if (!otherCat || !otherOwner) return null;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: 'white',
          marginHorizontal: 16,
          marginBottom: 12,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#f3f4f6',
          overflow: 'hidden'
        }}
        onPress={() => openChat(item._id)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          {/* Avatar */}
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#fce7f3',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16
          }}>
            {otherCat.photos?.length > 0 ? (
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#e5e7eb' }} />
            ) : (
              <Ionicons name="paw" size={32} color="#ec4899" />
            )}
          </View>

          {/* Info */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 }}>
              {otherCat.name}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 14, marginBottom: 4 }}>
              {otherCat.breed} • {otherCat.gender === 'male' ? '♂️ Male' : '♀️ Female'}
            </Text>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>
              with {otherOwner.displayName}
            </Text>
          </View>

          {/* Arrow */}
          <Ionicons name="chevron-forward" size={24} color="#d1d5db" />
        </View>

        {/* Last Message */}
        {item.lastMessageAt && (
          <View style={{
            paddingHorizontal: 16,
            paddingBottom: 12,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
            backgroundColor: '#fafafa'
          }}>
            <Text style={{ color: '#9ca3af', fontSize: 12 }}>
              💬 Last message: {new Date(item.lastMessageAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={{ color: '#6b7280', marginTop: 16, fontSize: 16 }}>Loading matches...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 24,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#ec4899' }}>💕 Matches</Text>
        <Text style={{ color: '#6b7280', marginTop: 4, fontSize: 16 }}>
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </Text>
      </View>

      {/* List */}
      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#ec4899"
            />
          }
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#fef2f2',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24
          }}>
            <Ionicons name="heart-dislike-outline" size={64} color="#fca5a5" />
          </View>
          <Text style={{ color: '#6b7280', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
            No matches yet
          </Text>
          <Text style={{ color: '#9ca3af', textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
            Start swiping to find your perfect match!
          </Text>
        </View>
      )}
    </View>
  );
}
