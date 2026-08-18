/**
 * Canonical notice-classification contract.
 *
 * Database rules, prompts, server validation, UI mappings, and tests should
 * derive their supported values from this module.
 */

export const MOODS = Object.freeze({
  BAD: "bad",
  NORMAL: "normal",
  GOOD: "good",
});

export const URGENCIES = Object.freeze({
  NO_RUSH: "no rush",
  URGENT: "urgent",
  EMERGENCY: "emergency",
});

export const ALLOWED_MOODS = Object.freeze(Object.values(MOODS));
export const ALLOWED_URGENCIES = Object.freeze(Object.values(URGENCIES));

export const MOOD_DEFINITIONS = Object.freeze({
  [MOODS.BAD]:
    "Negative, unhappy, concerning, angry, disappointing, or critical.",
  [MOODS.NORMAL]: "Neutral, factual, routine, or emotionally unclear.",
  [MOODS.GOOD]: "Positive, thankful, encouraging, or celebratory.",
});

export const URGENCY_DEFINITIONS = Object.freeze({
  [URGENCIES.NO_RUSH]: "No immediate action is required.",
  [URGENCIES.URGENT]:
    "Action is required soon or by a near-term deadline.",
  [URGENCIES.EMERGENCY]:
    "Immediate action is required to prevent serious harm, loss, outage, or disruption.",
});

export const DEFAULT_CLASSIFICATION = Object.freeze({
  mood: MOODS.NORMAL,
  urgency: URGENCIES.NO_RUSH,
});

export function isMood(value) {
  return typeof value === "string" && ALLOWED_MOODS.includes(value);
}

export function isUrgency(value) {
  return typeof value === "string" && ALLOWED_URGENCIES.includes(value);
}

export function isClassification(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    isMood(value.mood) &&
    isUrgency(value.urgency)
  );
}

export const CLASSIFICATION_EXAMPLES = Object.freeze([
  Object.freeze({
    notice: "The monthly report is available in the shared folder.",
    classification: Object.freeze({
      mood: MOODS.NORMAL,
      urgency: URGENCIES.NO_RUSH,
    }),
    rationale: "A routine factual update with no requested deadline.",
  }),
  Object.freeze({
    notice: "Thank you all for making the product launch a success!",
    classification: Object.freeze({
      mood: MOODS.GOOD,
      urgency: URGENCIES.NO_RUSH,
    }),
    rationale: "A celebratory message requiring no immediate action.",
  }),
  Object.freeze({
    notice: "The kitchen has repeatedly been left dirty after lunch.",
    classification: Object.freeze({
      mood: MOODS.BAD,
      urgency: URGENCIES.NO_RUSH,
    }),
    rationale: "A critical message without a near-term action requirement.",
  }),
  Object.freeze({
    notice: "Great work on the proposal; please submit the final copy by 3 PM today.",
    classification: Object.freeze({
      mood: MOODS.GOOD,
      urgency: URGENCIES.URGENT,
    }),
    rationale: "Positive sentiment and a near-term deadline are independent.",
  }),
  Object.freeze({
    notice: "The production site is down; start the incident response now.",
    classification: Object.freeze({
      mood: MOODS.BAD,
      urgency: URGENCIES.EMERGENCY,
    }),
    rationale: "An active outage requires immediate action to limit disruption.",
  }),
  Object.freeze({
    notice: "We may want to revisit the meeting schedule.",
    classification: Object.freeze({
      mood: MOODS.NORMAL,
      urgency: URGENCIES.NO_RUSH,
    }),
    rationale:
      "Emotionally unclear language without an explicit deadline or serious immediate risk uses neutral defaults.",
  }),
]);
