import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
    const { i18n, t } = useTranslation();

    return {
        language: i18n.language,
        t,
        changeLanguage: (lang: string) => i18n.changeLanguage(lang),
        availableLanguages: ['en', 'fr']
    };
};
