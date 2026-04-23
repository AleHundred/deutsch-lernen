import { describe, it, expect } from "vitest";
import { evaluate, computeGrade } from "./evaluate";
import type { DrillItem } from "../db/schema";

function mkItem(params: Record<string, string>): DrillItem {
  return {
    id: "test-id",
    kind: "slot-classification",
    params,
    rule: "test-rule",
    grammarTopic: "tekamolo",
    difficulty: 1,
  };
}

describe("evaluate (slot-classification)", () => {
  it("correct + fast (<2000ms) returns grade 5 and no declarative flag", () => {
    const item = mkItem({
      phrase: "mit dem Fahrrad",
      correctSlot: "Mo",
      subtype: "means-transport",
    });
    const result = evaluate(item, "Mo", 1500);
    expect(result.correct).toBe(true);
    expect(result.grade).toBe(5);
    expect(result.declarative).toBe(false);
    expect(result.correctAnswer).toBe("Mo (means-transport)");
    expect(result.yourAnswer).toBe("Mo");
  });

  it("correct + medium (2000–4000ms) returns grade 4, no declarative flag", () => {
    const item = mkItem({
      phrase: "mit dem Fahrrad",
      correctSlot: "Mo",
      subtype: "means-transport",
    });
    const result = evaluate(item, "Mo", 3000);
    expect(result.correct).toBe(true);
    expect(result.grade).toBe(4);
    expect(result.declarative).toBe(false);
  });

  it("correct + slow (>4000ms) surfaces the declarative flag and grade 3", () => {
    const item = mkItem({
      phrase: "mit dem Fahrrad",
      correctSlot: "Mo",
      subtype: "means-transport",
    });
    const result = evaluate(item, "Mo", 5200);
    expect(result.correct).toBe(true);
    expect(result.grade).toBe(3);
    expect(result.declarative).toBe(true);
  });

  it("wrong answer returns correctAnswer, grade 1, no declarative flag", () => {
    const item = mkItem({
      phrase: "vor Angst",
      correctSlot: "Ka",
      subtype: "emotion-cause",
    });
    const result = evaluate(item, "Te", 1200);
    expect(result.correct).toBe(false);
    expect(result.correctAnswer).toBe("Ka (emotion-cause)");
    expect(result.yourAnswer).toBe("Te");
    expect(result.grade).toBe(1);
    expect(result.declarative).toBe(false);
  });

  it("surfaces disambiguationNote as explanation when present", () => {
    const item = mkItem({
      phrase: "vor Angst",
      correctSlot: "Ka",
      subtype: "emotion-cause",
      disambiguationNote: "vor + emotion → Ka",
    });
    const result = evaluate(item, "Ka", 1500);
    expect(result.explanation).toBe("vor + emotion → Ka");
  });

  it("falls back to a generated explanation when no disambiguationNote", () => {
    const item = mkItem({
      phrase: "mit dem Fahrrad",
      correctSlot: "Mo",
      subtype: "means-transport",
    });
    const correctResult = evaluate(item, "Mo", 1000);
    expect(correctResult.explanation).toBe("Mo — means-transport");
    const wrongResult = evaluate(item, "Lo", 1000);
    expect(wrongResult.explanation).toBe(
      "Expected Mo (means-transport); you answered Lo",
    );
  });

  it("parses JSON-stringified examples into structured objects", () => {
    const examples = [
      { phrase: "vor zwei Wochen", slot: "Te", sameSlot: false },
      { phrase: "vor dem Tipsy Bear", slot: "Lo", sameSlot: false },
    ];
    const item = mkItem({
      phrase: "vor Angst",
      correctSlot: "Ka",
      subtype: "emotion-cause",
      examples: JSON.stringify(examples),
    });
    const result = evaluate(item, "Ka", 1500);
    expect(result.examples).toEqual(examples);
  });

  it("omits examples when the item has none", () => {
    const item = mkItem({
      phrase: "heute",
      correctSlot: "Te",
      subtype: "bare-adverb",
    });
    const result = evaluate(item, "Te", 1000);
    expect(result.examples).toBeUndefined();
  });
});

describe("computeGrade", () => {
  it("wrong → 1", () => expect(computeGrade(false, 1000)).toBe(1));
  it("correct <2000ms → 5", () => expect(computeGrade(true, 1999)).toBe(5));
  it("correct at 2000ms → 4", () => expect(computeGrade(true, 2000)).toBe(4));
  it("correct at 4000ms → 4", () => expect(computeGrade(true, 4000)).toBe(4));
  it("correct >4000ms → 3", () => expect(computeGrade(true, 4001)).toBe(3));
});
