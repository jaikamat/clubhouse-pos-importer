export default function pluralize(quantity: number, word: string) {
    return `${word}${quantity === 1 ? '' : 's'}`;
}
