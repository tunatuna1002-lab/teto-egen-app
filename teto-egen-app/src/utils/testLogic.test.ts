import { describe, it, expect } from 'vitest';
import { calculateCompatibility } from './testLogic';

describe('calculateCompatibility (S.A.C Algorithm)', () => {
    it('calculates high attraction for opposite types (Synergy)', () => {
        // Teto (90) vs Egen (10) -> Delta 80
        const result = calculateCompatibility(90, 10, 'ENTJ', 'ISFP');

        // Base 60 + (80 * 0.4 = 32) + MBTI_EI_Diff(5) = 97
        expect(result.attraction).toBeGreaterThan(80);
    });

    it('calculates high stability for Similar SN/JP (Alignment)', () => {
        // Share S and J (e.g. ESTJ vs ISTJ)
        const result = calculateCompatibility(70, 60, 'ESTJ', 'ISTJ');

        // Base 50 + SN(20) + JP(20) = 90
        // Delta 10 -> No penalty
        expect(result.stability).toBeGreaterThan(80);
    });

    it('calculates high conflict for JP mismatch and High T (Challenge)', () => {
        // Both high T (80, 80) -> Avg 80 -> High Ego (+20)
        // JP Mismatch (J vs P) -> Lifestyle (+25)
        // TF Match (T vs T) -> No Comm penalty
        const result = calculateCompatibility(80, 80, 'ESTJ', 'ENTP');

        expect(result.conflict).toBeGreaterThan(60);
    });
});
