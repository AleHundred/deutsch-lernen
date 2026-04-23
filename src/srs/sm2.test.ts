import { describe, test, expect } from 'vitest';
import { sm2 } from './sm2';
import type { SRSState } from '@/db/schema';

describe('SM-2 Algorithm', () => {
  const baseDate = new Date('2024-01-01T12:00:00Z');

  test('new item first correct → interval 1', () => {
    const result = sm2(undefined, 4, baseDate);

    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
    expect(result.easeFactor).toBeCloseTo(2.5);
    expect(result.totalCorrect).toBe(1);
    expect(result.totalAttempts).toBe(1);

    // Next review should be 1 day later
    const expectedNext = new Date(baseDate);
    expectedNext.setDate(expectedNext.getDate() + 1);
    expect(result.nextReview).toBe(expectedNext.toISOString());
  });

  test('two consecutive correct → interval 6', () => {
    // First review (correct)
    const state1 = sm2(undefined, 4, baseDate);

    // Second review (correct)
    const secondDate = new Date(baseDate);
    secondDate.setDate(secondDate.getDate() + 1);
    const state2 = sm2(state1, 4, secondDate);

    expect(state2.interval).toBe(6);
    expect(state2.repetitions).toBe(2);
    expect(state2.totalCorrect).toBe(2);
    expect(state2.totalAttempts).toBe(2);

    // Next review should be 6 days later
    const expectedNext = new Date(secondDate);
    expectedNext.setDate(expectedNext.getDate() + 6);
    expect(state2.nextReview).toBe(expectedNext.toISOString());
  });

  test('three consecutive correct with EF 2.5 → interval 15', () => {
    // First review (correct with perfect grade to maintain EF at 2.5)
    const state1 = sm2(undefined, 4, baseDate);

    // Second review (correct)
    const date2 = new Date(baseDate);
    date2.setDate(date2.getDate() + 1);
    const state2 = sm2(state1, 4, date2);

    // Third review (correct)
    const date3 = new Date(date2);
    date3.setDate(date3.getDate() + 6);
    const state3 = sm2(state2, 4, date3);

    // interval should be round(6 * 2.5) = 15
    expect(state3.interval).toBe(15);
    expect(state3.repetitions).toBe(3);
    expect(state3.totalCorrect).toBe(3);
    expect(state3.totalAttempts).toBe(3);
  });

  test('wrong answer resets interval to 1, EF decreases but clamps at 1.3', () => {
    // Build up some progress first
    const state1 = sm2(undefined, 4, baseDate);
    const date2 = new Date(baseDate);
    date2.setDate(date2.getDate() + 1);
    const state2 = sm2(state1, 4, date2);

    // Now get it wrong
    const date3 = new Date(date2);
    date3.setDate(date3.getDate() + 6);
    const state3 = sm2(state2, 0, date3); // Grade 0 = completely wrong

    expect(state3.interval).toBe(1); // Reset to 1
    expect(state3.repetitions).toBe(0); // Reset to 0
    expect(state3.totalCorrect).toBe(2); // Still 2 correct (from before)
    expect(state3.totalAttempts).toBe(3); // 3 total attempts

    // EF should decrease but not below 1.3
    expect(state3.easeFactor).toBeLessThan(state2.easeFactor);
    expect(state3.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  test('EF clamps at minimum 1.3 with repeated failures', () => {
    let state: SRSState | undefined = undefined;
    const testDate = new Date(baseDate);

    // Repeatedly fail to drive EF down
    for (let i = 0; i < 10; i++) {
      testDate.setDate(testDate.getDate() + 1);
      state = sm2(state, 0, testDate); // Always grade 0
    }

    // EF should be clamped at 1.3
    expect(state!.easeFactor).toBe(1.3);
    expect(state!.interval).toBe(1);
    expect(state!.repetitions).toBe(0);
  });

  test('EF never exceeds 3.0 with perfect scores', () => {
    let state: SRSState | undefined = undefined;
    let testDate = new Date(baseDate);

    // Repeatedly get perfect scores (but stop before interval gets too huge)
    for (let i = 0; i < 10; i++) {
      // Create new date to avoid mutation issues
      testDate = new Date(testDate);
      testDate.setDate(testDate.getDate() + (state?.interval || 1));
      state = sm2(state, 5, testDate); // Always perfect grade
    }

    // EF should be clamped at 3.0
    expect(state!.easeFactor).toBe(3.0);
    expect(state!.repetitions).toBe(10);
    // After 10 perfect scores, interval should be very large
    expect(state!.interval).toBeGreaterThan(1000);
  });

  test('response time does NOT affect scheduling', () => {
    // Create initial state with response time in recentAttempts
    const initialState: SRSState = {
      itemId: 'test-item',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: baseDate.toISOString(),
      totalAttempts: 1,
      totalCorrect: 1,
      recentAttempts: [
        {
          at: baseDate.toISOString(),
          correct: true,
          responseTimeMs: 10000, // Very slow response
          userAnswer: 'test'
        }
      ]
    };

    // Grade the item (the response time in recentAttempts should not affect the result)
    const result1 = sm2(initialState, 4, baseDate);

    // Try again with same state but different response time
    const stateWithFastResponse = {
      ...initialState,
      recentAttempts: [
        {
          at: baseDate.toISOString(),
          correct: true,
          responseTimeMs: 100, // Very fast response
          userAnswer: 'test'
        }
      ]
    };

    const result2 = sm2(stateWithFastResponse, 4, baseDate);

    // Results should be identical regardless of response time
    expect(result1.interval).toBe(result2.interval);
    expect(result1.easeFactor).toBe(result2.easeFactor);
    expect(result1.repetitions).toBe(result2.repetitions);
    expect(result1.nextReview).toBe(result2.nextReview);
  });

  test('grade boundaries work correctly', () => {
    // Grade 2 is still wrong
    const wrong = sm2(undefined, 2, baseDate);
    expect(wrong.repetitions).toBe(0);
    expect(wrong.interval).toBe(1);
    expect(wrong.totalCorrect).toBe(0);

    // Grade 3 is the minimum correct
    const correct = sm2(undefined, 3, baseDate);
    expect(correct.repetitions).toBe(1);
    expect(correct.interval).toBe(1);
    expect(correct.totalCorrect).toBe(1);
  });

  test('lastGrade and lastReview are properly set', () => {
    const result = sm2(undefined, 4, baseDate);

    expect(result.lastGrade).toBe(4);
    expect(result.lastReview).toBe(baseDate.toISOString());
  });

  test('preserves itemId from existing state', () => {
    const existingState: SRSState = {
      itemId: 'test-item-123',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      nextReview: baseDate.toISOString(),
      totalAttempts: 0,
      totalCorrect: 0,
      recentAttempts: []
    };

    const result = sm2(existingState, 4, baseDate);
    expect(result.itemId).toBe('test-item-123');
  });
});