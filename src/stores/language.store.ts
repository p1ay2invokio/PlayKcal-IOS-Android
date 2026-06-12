import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { translations, Locale, TranslationKey, SUPPORTED_LANGUAGES } from '../constants/translations'
import dayjs from 'dayjs'
import 'dayjs/locale/th'

interface LanguageState {
  locale: Locale;
  isReady: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  loadLocale: () => Promise<void>;
  t: (key: TranslationKey, params?: Record<string, any>) => string;
}

const createTranslator = (locale: Locale) => {
  return (key: TranslationKey, params?: Record<string, any>) => {
    const translationSet = translations[locale] || translations.en;
    let text: string = String(translationSet[key] || translations.en[key] || key);
    
    if (params) {
      Object.keys(params).forEach((paramKey) => {
        text = text.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return text;
  };
};

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: 'en',
  isReady: false,
  t: createTranslator('en'),
  setLocale: async (locale: Locale) => {
    console.log("setLocale called with:", locale);
    try {
      await AsyncStorage.setItem('locale', locale);
      console.log("Saved locale to AsyncStorage successfully");
    } catch (e) {
      console.error("Failed to save locale to AsyncStorage:", e);
    }
    try {
      dayjs.locale(locale);
    } catch (err) {
      console.warn("Failed to set dayjs locale:", err);
    }
    set({ locale, t: createTranslator(locale) });
    console.log("Store state updated. New locale:", get().locale);
  },
  loadLocale: async () => {
    try {
      const savedLocale = await AsyncStorage.getItem('locale');
      const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === savedLocale);
      if (isSupported && savedLocale) {
        try {
          dayjs.locale(savedLocale);
        } catch (err) {
          console.warn("Failed to set dayjs locale during load:", err);
        }
        set({ locale: savedLocale as Locale, isReady: true, t: createTranslator(savedLocale as Locale) });
      } else {
        try {
          dayjs.locale('en');
        } catch (err) {
          console.warn("Failed to set dayjs locale to en during load:", err);
        }
        set({ isReady: true, t: createTranslator('en') });
      }
    } catch (e) {
      try {
        dayjs.locale('en');
      } catch (err) {
        console.warn("Failed to set dayjs locale to en in load catch:", err);
      }
      set({ isReady: true, t: createTranslator('en') });
    }
  },
}))
export const t = (key: TranslationKey, params?: Record<string, any>) => {
  return useLanguageStore.getState().t(key, params);
};
