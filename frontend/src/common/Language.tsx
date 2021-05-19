import React, { FC } from 'react';
import { Label } from 'semantic-ui-react';
import { LanguageCode } from '../utils/ScryfallCard';

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
interface Props {
    languageCode: LanguageCode;
}

const Language: FC<Props> = ({ languageCode }) => (
    <Label image color="grey">
        {LANG_CODES[languageCode]}
    </Label>
);

export default Language;
