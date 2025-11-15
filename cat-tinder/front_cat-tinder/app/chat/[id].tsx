import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { matchesApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import type { Message, Match, Cat, Owner } from '../../types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { ownerId } = useAuth();

  const [match, setMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (id) {
      loadMatchAndMessages();
    }
  }, [id]);

  const loadMatchAndMessages = async () => {
    try {
      setIsLoading(true);

      // Load match details
      const matchResponse = await matchesApi.getMatchById(id!);
      setMatch(matchResponse.match);

      // Load messages
      const messagesResponse = await matchesApi.getMessages(id!, { limit: 100 });
      setMessages(messagesResponse.messages);
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);

    try {
      const response = await matchesApi.sendMessage(id!, { text: messageText });
      setMessages((prev) => [...prev, response.message]);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      setInputText(messageText); // Restore text on error
    } finally {
      setIsSending(false);
    }
  };

  const getOtherCat = (): Cat | null => {
    if (!match) return null;

    const ownerAId = typeof match.ownerAId === 'object' ? match.ownerAId._id : match.ownerAId;

    if (ownerAId === ownerId) {
      return typeof match.catBId === 'object' ? match.catBId : null;
    } else {
      return typeof match.catAId === 'object' ? match.catAId : null;
    }
  };

  const getOtherOwner = (): Owner | null => {
    if (!match) return null;

    const ownerAId = typeof match.ownerAId === 'object' ? match.ownerAId._id : match.ownerAId;

    if (ownerAId === ownerId) {
      return typeof match.ownerBId === 'object' ? match.ownerBId : null;
    } else {
      return typeof match.ownerAId === 'object' ? match.ownerAId : null;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage =
      typeof item.senderOwnerId === 'string'
        ? item.senderOwnerId === ownerId
        : item.senderOwnerId._id === ownerId;

    return (
      <View
        style={{
          marginBottom: 12,
          paddingHorizontal: 16,
          alignItems: isMyMessage ? 'flex-end' : 'flex-start',
        }}
      >
        <View
          style={{
            maxWidth: '75%',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: isMyMessage ? '#ec4899' : '#f3f4f6',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text
            style={{
              color: isMyMessage ? '#ffffff' : '#1f2937',
              fontSize: 15,
              lineHeight: 20,
            }}
          >
            {item.text}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 11,
            color: '#9ca3af',
            marginTop: 4,
            marginHorizontal: 4,
          }}
        >
          {new Date(item.sentAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={{ color: '#6b7280', marginTop: 16, fontSize: 16 }}>
          Loading chat...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 16,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e5e7eb',
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginRight: 12,
            padding: 4,
          }}
        >
          <Ionicons name="chevron-back" size={28} color="#1f2937" />
        </TouchableOpacity>

        {/* Cat Avatar */}
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#fce7f3',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="paw" size={24} color="#ec4899" />
        </View>

        <View style={{ flex: 1 }}>
          {match ? (
            <>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: '#1f2937',
                }}
              >
                {getOtherCat()?.name || 'Chat'}
              </Text>
              <Text
                style={{
                  color: '#6b7280',
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                with {getOtherOwner()?.displayName}
              </Text>
            </>
          ) : (
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#1f2937',
              }}
            >
              Loading...
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: '#f3f4f6',
          }}
        >
          <Ionicons name="information-circle-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingVertical: 16 }}
        style={{ backgroundColor: '#f9fafb' }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 80,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: '#fef2f2',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="chatbubbles-outline" size={40} color="#f9a8d4" />
            </View>
            <Text
              style={{
                color: '#9ca3af',
                marginTop: 8,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              No messages yet
            </Text>
            <Text
              style={{
                color: '#d1d5db',
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Say hi! 👋
            </Text>
          </View>
        }
      />

      {/* Input Area */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              fontSize: 15,
              maxHeight: 100,
            }}
            placeholder="Type a message..."
            placeholderTextColor="#9ca3af"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor:
                inputText.trim() && !isSending ? '#ec4899' : '#e5e7eb',
              shadowColor: inputText.trim() && !isSending ? '#ec4899' : '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: inputText.trim() && !isSending ? 0.3 : 0.1,
              shadowRadius: 4,
              elevation: inputText.trim() && !isSending ? 4 : 2,
            }}
            onPress={sendMessage}
            disabled={!inputText.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons
                name="send"
                size={22}
                color={inputText.trim() ? 'white' : '#9ca3af'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
