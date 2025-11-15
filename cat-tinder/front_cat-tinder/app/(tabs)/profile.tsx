import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { ownerId, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <View style={{
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 24,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="person-circle" size={32} color="#ec4899" />
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#ec4899' }}>Profile</Text>
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24 }}>
        {/* Owner Info Card */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#f3f4f6',
          marginBottom: 16
        }}>
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#fce7f3',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 3,
              borderColor: '#fbcfe8'
            }}>
              <Ionicons name="person" size={48} color="#ec4899" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1f2937', marginBottom: 4 }}>Test User</Text>
            <View style={{
              backgroundColor: '#fef3c7',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4
            }}>
              <Ionicons name="trophy" size={12} color="#d97706" />
              <Text style={{ color: '#d97706', fontSize: 12, fontWeight: '600' }}>Owner</Text>
            </View>
          </View>

          <View style={{
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
            paddingTop: 16
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#e5e7eb',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Ionicons name="key-outline" size={16} color="#6b7280" />
              </View>
              <Text style={{
                color: '#6b7280',
                marginLeft: 12,
                flex: 1,
                fontFamily: 'monospace',
                fontSize: 11
              }} numberOfLines={1}>
                {ownerId}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#f3f4f6',
          overflow: 'hidden',
          marginBottom: 16
        }}>
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6'
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#fef3c7',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons name="paw-outline" size={20} color="#d97706" />
            </View>
            <Text style={{ color: '#1f2937', marginLeft: 16, flex: 1, fontWeight: '600', fontSize: 16 }}>
              My Cats
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6'
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#dbeafe',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons name="time-outline" size={20} color="#2563eb" />
            </View>
            <Text style={{ color: '#1f2937', marginLeft: 16, flex: 1, fontWeight: '600', fontSize: 16 }}>
              Swipe History
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#e0e7ff',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Ionicons name="settings-outline" size={20} color="#6366f1" />
            </View>
            <Text style={{ color: '#1f2937', marginLeft: 16, flex: 1, fontWeight: '600', fontSize: 16 }}>
              Settings
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ef4444',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#ef4444',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }}
          onPress={handleLogout}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={{ color: 'white', marginLeft: 12, fontWeight: 'bold', fontSize: 18 }}>Logout</Text>
          </View>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 4 }}>
          <Ionicons name="paw" size={14} color="#9ca3af" />
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>
            Cat Tinder v1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
}
