import { LanguageCode } from './ClientCard';

const LANG_CODES: Record<LanguageCode, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ja: 'Japanese',
    ko: 'Korean',
    ru: 'Russian',
    zhs: 'Simplified Chinese',
    zht: 'Traditional Chinese',
    he: 'Hebrew',
    la: 'Latin',
    grc: 'Ancient Greek',
    ar: 'Arabic',
    sa: 'Sanskrit',
    px: 'Phyrexian',
};

function language(languageCode: LanguageCode): string {
    return LANG_CODES[languageCode];
}

export default language;
