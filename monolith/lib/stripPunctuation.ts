const stripPunctuation = (str: string): string => {
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
};

export default stripPunctuation;
