/**
 * Sums numbers up
 */
export default function sum(nums: number[]): number {
    return nums.reduce((acc, curr) => acc + curr, 0);
}
