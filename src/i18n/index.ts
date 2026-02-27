/**
 * Romanian localization for AAC app (5+ year old, neurodivergent-friendly).
 * All UI strings in one place for consistency and future multi-language.
 */

import { ro } from './ro';

const messages: Record<string, string> = ro;

export function t(key: keyof typeof ro): string {
  return messages[key] ?? key;
}

export type MessageKey = keyof typeof ro;
