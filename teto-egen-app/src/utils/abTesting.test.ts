import { describe, it, expect } from 'vitest';
import { getCTAOrder, calculateMetrics } from './abTesting';

describe('abTesting Utils', () => {
    describe('getCTAOrder', () => {
        it('returns correct order for bucket A', () => {
            const order = getCTAOrder('A');
            expect(order).toEqual(['share', 'match', 'reward']);
        });

        it('returns correct order for bucket B', () => {
            const order = getCTAOrder('B');
            expect(order).toEqual(['reward', 'share', 'match']);
        });

        it('returns correct order for bucket C', () => {
            const order = getCTAOrder('C');
            expect(order).toEqual(['match', 'share', 'reward']);
        });
    });

    describe('calculateMetrics', () => {
        it('calculates completion rates correctly', () => {
            const events = [
                { type: 'result_view' },
                { type: 'result_view' }, // 2 views
                { type: 'share_complete' }, // 1 share
                { type: 'reward_open' },
                { type: 'reward_complete' } // 1 reward
            ];

            const metrics = calculateMetrics(events);

            expect(metrics.shareRate).toBe(0.5); // 1/2
            expect(metrics.rewardConversion).toBe(1.0); // 1/1
            expect(metrics.arpdau).toBe(2 / 5); // 2 actions / 5 events
        });

        it('handles division by zero gracefully', () => {
            const metrics = calculateMetrics([]);
            expect(metrics.shareRate).toBe(0);
            expect(metrics.rewardConversion).toBe(0);
        });
    });
});
