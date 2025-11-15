import { useState, useEffect } from "react";
import { Text, View, TextInput, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { ownerId, setOwnerId, isLoading } = useAuth();
  const [inputOwnerId, setInputOwnerId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Navigation helper that works on both web and native
  const navigateToHome = () => {
    if (Platform.OS === 'web') {
      // For web, use window.location
      if (typeof window !== 'undefined') {
        window.location.href = '/(tabs)/home';
      }
    } else {
      // For native, use router
      try {
        router.replace("/(tabs)/home");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    }
  };

  // ถ้ามี owner ID แล้ว redirect ไปหน้า home
  useEffect(() => {
    if (ownerId && !isLoading) {
      navigateToHome();
    }
  }, [ownerId, isLoading]);

  const handleSetOwnerId = async () => {
    if (!inputOwnerId.trim()) {
      alert("Please enter Owner ID");
      return;
    }

    setIsSaving(true);
    try {
      await setOwnerId(inputOwnerId.trim());

      // Add small delay to ensure state is saved
      setTimeout(() => {
        navigateToHome();
      }, 100);
    } catch (error) {
      alert("Error saving Owner ID");
    } finally {
      setIsSaving(false);
    }
  };

  const quickSelect = (id: string) => {
    setInputOwnerId(id);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdf2f8' }}>
        <View style={{ 
          backgroundColor: 'white', 
          padding: 32, 
          borderRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8
        }}>
          <Ionicons name="paw" size={48} color="#ec4899" style={{ marginBottom: 16, alignSelf: 'center' }} />
          <ActivityIndicator size="large" color="#ec4899" />
          <Text style={{ color: '#6b7280', marginTop: 16, fontSize: 16 }}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fdf2f8' }}>
      {/* Decorative Background */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300, backgroundColor: '#ec4899', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }} />
      
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 24 }}>
        {/* Logo & Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ 
            width: 100, 
            height: 100, 
            borderRadius: 50, 
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 12
          }}>
            <Ionicons name="paw" size={56} color="#ec4899" />
          </View>
          
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 8 }}>
            Cat Tinder
          </Text>
          <Text style={{ fontSize: 16, color: '#fce7f3', textAlign: 'center' }}>
            Find the perfect match for your cat
          </Text>
        </View>

        {/* Main Card */}
        <View style={{ 
          backgroundColor: 'white',
          borderRadius: 24,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
          elevation: 10
        }}>
          {/* Input Section */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 }}>
              <Ionicons name="key" size={20} color="#6b7280" />
              <Text style={{ fontSize: 16, color: '#1f2937', fontWeight: '600' }}>
                Enter Owner ID
              </Text>
            </View>

            <View style={{ 
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f9fafb',
              borderWidth: 2,
              borderColor: '#e5e7eb',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 4
            }}>
              <Ionicons name="finger-print" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
              <TextInput
                style={{ 
                  flex: 1,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: '#1f2937'
                }}
                placeholder="Paste Owner ID here..."
                placeholderTextColor="#9ca3af"
                value={inputOwnerId}
                onChangeText={setInputOwnerId}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#ec4899',
              borderRadius: 16,
              paddingVertical: 16,
              marginBottom: 20,
              shadowColor: '#ec4899',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6
            }}
            onPress={handleSetOwnerId}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                  Continue
                </Text>
                <Ionicons name="arrow-forward-circle" size={24} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
            <Text style={{ marginHorizontal: 16, color: '#9ca3af', fontSize: 13, fontWeight: '500' }}>
              Quick Select
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
          </View>

          {/* Quick Select Buttons */}
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#dbeafe',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: '#bfdbfe'
              }}
              onPress={() => quickSelect("68e5a2f5cdd13a306386bc08")}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ 
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#3b82f6',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="person" size={20} color="white" />
                </View>
                <Text style={{ fontSize: 16, color: '#1e40af', fontWeight: '600' }}>
                  Owner 1 (Demo User)
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: '#60a5fa', fontFamily: 'monospace', marginLeft: 48 }}>
                68e5a2f5cdd13a306386bc08
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: '#e9d5ff',
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: '#d8b4fe'
              }}
              onPress={() => quickSelect("68e5a2f5cdd13a306386bc0b")}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ 
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#a855f7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12
                }}>
                  <Ionicons name="person" size={20} color="white" />
                </View>
                <Text style={{ fontSize: 16, color: '#6b21a8', fontWeight: '600' }}>
                  Owner 2 (Alice)
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: '#a78bfa', fontFamily: 'monospace', marginLeft: 48 }}>
                68e5a2f5cdd13a306386bc0b
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tip */}
          <View style={{ 
            backgroundColor: '#fffbeb',
            borderRadius: 12,
            padding: 12,
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'flex-start',
            borderWidth: 1,
            borderColor: '#fef3c7'
          }}>
            <Ionicons name="information-circle" size={20} color="#f59e0b" style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={{ flex: 1, fontSize: 12, color: '#92400e', lineHeight: 18 }}>
              Run <Text style={{ fontFamily: 'monospace', fontWeight: '600' }}>npm run seed</Text> in backend to get fresh Owner IDs
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, gap: 6 }}>
          <Ionicons name="shield-checkmark" size={16} color="#9ca3af" />
          <Text style={{ fontSize: 13, color: '#6b7280' }}>
            Secure • Fast • Cat-Friendly
          </Text>
        </View>
      </View>
    </View>
  );
}
