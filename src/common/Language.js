import React from 'react';
import { Label } from 'semantic-ui-react';

// Language codes from Scryfall. See https://scryfall.com/docs/api/languages for reference.
const LANG_CODES = {
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
    px: 'Phyrexian'
}

export default function Language({ languageCode }) {
    return <Label image color="grey">{LANG_CODES[languageCode]}</Label>
}