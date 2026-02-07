import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSettings, NotificationPreferences, SecuritySettings, IntentPreferences } from '@/types/settings';

interface SettingsState extends UserSettings {
  // Actions
  updateIntentPreferences: (preferences: Partial<IntentPreferences>) => void;
  updateNotifications: (notifications: Partial<NotificationPreferences>) => void;
  updateSecurity: (security: Partial<SecuritySettings>) => void;
  updateTheme: (theme: 'light' | 'dark' | 'system') => void;
  updateWalletPreferences: (preferences: Partial<UserSettings['wallet_preferences']>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: UserSettings = {
  wallet_preferences: {
    auto_connect: false,
    default_network: 'testnet',
  },
  intent_preferences: {
    default_slippage_tolerance: 1.0,
    max_gas_fee: '1000000',
    auto_approve_trusted: false,
  },
  notifications: {
    intent_completed: true,
    intent_failed: true,
    price_alerts: false,
    weekly_summary: true,
    email_notifications: false,
    push_notifications: true,
  },
  security: {
    whitelisted_addresses: [],
    session_timeout_minutes: 30,
  },
  theme: 'system',
  language: 'en',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      // Update intent preferences
      updateIntentPreferences: (preferences: Partial<IntentPreferences>) => {
        set((state) => ({
          intent_preferences: {
            ...state.intent_preferences,
            ...preferences,
          },
        }));
      },

      // Update notifications
      updateNotifications: (notifications: Partial<NotificationPreferences>) => {
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...notifications,
          },
        }));
      },

      // Update security settings
      updateSecurity: (security: Partial<SecuritySettings>) => {
        set((state) => ({
          security: {
            ...state.security,
            ...security,
          },
        }));
      },

      // Update theme
      updateTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
      },

      // Update wallet preferences
      updateWalletPreferences: (preferences: Partial<UserSettings['wallet_preferences']>) => {
        set((state) => ({
          wallet_preferences: {
            ...state.wallet_preferences,
            ...preferences,
          },
        }));
      },

      // Reset to defaults
      resetToDefaults: () => {
        set(defaultSettings);
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
