'use client';

// Solved-problem tracking + per-problem code drafts, persisted in localStorage.

const SOLVED_KEY = 'lootcode:solved';
const DRAFT_KEY = (problemId: string, lang: string) => `lootcode:draft:${problemId}:${lang}`;

export function getSolved(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(SOLVED_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

export function markSolved(problemId: string): void {
  if (typeof window === 'undefined') return;
  const solved = getSolved();
  solved.add(problemId);
  localStorage.setItem(SOLVED_KEY, JSON.stringify([...solved]));
  window.dispatchEvent(new Event('lootcode:progress'));
}

export function isSolved(problemId: string): boolean {
  return getSolved().has(problemId);
}

export function loadDraft(problemId: string, lang: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DRAFT_KEY(problemId, lang));
}

export function saveDraft(problemId: string, lang: string, code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFT_KEY(problemId, lang), code);
}

export function clearDraft(problemId: string, lang: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DRAFT_KEY(problemId, lang));
}
