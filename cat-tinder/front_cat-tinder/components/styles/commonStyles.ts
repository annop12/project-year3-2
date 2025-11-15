import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#ec4899',
  secondary: '#f3e8ff',
  gray: {
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  },
  pink: {
    100: '#fce7f3',
    500: '#ec4899',
    600: '#db2777',
  },
  purple: {
    100: '#f3e8ff',
    700: '#6b46c1',
  },
  red: {
    100: '#fee2e2',
    500: '#ef4444',
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[600],
  },
  label: {
    fontSize: 14,
    color: colors.gray[500],
  },
});
