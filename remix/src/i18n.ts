import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationFR from './locales/fr/translation.json'
import translationEN from './locales/en/translation.json'

const resources = {
	en: {
		translation: translationEN
	},
	fr: {
		translation: translationFR
	}
}

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources,
		fallbackLng: 'en',
		keySeparator: false,
		detection: {
			order: ['localStorage']
		},
		interpolation: {
			escapeValue: false
		},
		debug: false
	})

export default i18n
