import { create } from "zustand";
import type { DrillItem, DrillKind, SRSState } from "../db/schema";
import type { EvaluationResult } from "../drills/types";
import { evaluate } from "../drills/evaluate";
import { sm2 } from "../srs/sm2";
import { db } from "../db/db";

export interface Attempt {
  itemId: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
  responseTimeMs: number;
}

interface SessionStore {
  items: DrillItem[];
  currentIndex: number;
  attempts: Attempt[];
  startedAt: Date | null;

  startSession: (items: DrillItem[]) => void;
  answerCurrent: (
    userAnswer: string,
    responseTimeMs: number,
  ) => Promise<EvaluationResult>;
  advance: () => void;
  finish: () => Promise<void>;
  reset: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  items: [],
  currentIndex: 0,
  attempts: [],
  startedAt: null,

  startSession: (items) => {
    set({ items, currentIndex: 0, attempts: [], startedAt: new Date() });
  },

  answerCurrent: async (userAnswer, responseTimeMs) => {
    const { items, currentIndex, attempts } = get();
    const item = items[currentIndex];
    if (!item) throw new Error("answerCurrent: no current item");

    const result = evaluate(item, userAnswer, responseTimeMs);
    const now = new Date();
    const prev = await db.srsState.get(item.id);

    const base = sm2(prev, result.grade, now);
    const attemptRecord = {
      at: now.toISOString(),
      correct: result.correct,
      responseTimeMs,
      userAnswer,
    };
    const nextState: SRSState = {
      ...base,
      itemId: item.id,
      recentAttempts: [...(prev?.recentAttempts ?? []), attemptRecord].slice(-20),
    };
    await db.srsState.put(nextState);

    const attempt: Attempt = {
      itemId: item.id,
      userAnswer,
      correctAnswer: result.feedback.correctAnswer,
      correct: result.correct,
      responseTimeMs,
    };
    set({ attempts: [...attempts, attempt] });

    return result;
  },

  advance: () => {
    set((s) => ({ currentIndex: s.currentIndex + 1 }));
  },

  finish: async () => {
    const { items, attempts, startedAt } = get();
    if (!startedAt) return;
    const kinds = new Set(items.map((i) => i.kind));
    const kind: DrillKind | "mixed" =
      kinds.size === 1 ? ([...kinds][0] as DrillKind) : "mixed";
    await db.sessions.add({
      id: crypto.randomUUID(),
      startedAt: startedAt.toISOString(),
      endedAt: new Date().toISOString(),
      kind,
      attempts,
    });
  },

  reset: () => {
    set({ items: [], currentIndex: 0, attempts: [], startedAt: null });
  },
}));
