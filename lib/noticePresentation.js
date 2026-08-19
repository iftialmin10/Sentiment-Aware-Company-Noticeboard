import { MOODS, URGENCIES } from "./classificationContract.js";

export const MOOD_PRESENTATIONS = Object.freeze({
  [MOODS.BAD]: Object.freeze({
    label: "bad",
    backgroundColor: "#fff7f7",
    borderColor: "#ef9a9a",
    chipBackgroundColor: "#fee4e2",
    chipColor: "#7a271a",
  }),
  [MOODS.NORMAL]: Object.freeze({
    label: "normal",
    backgroundColor: "#ffffff",
    borderColor: "#d7dce3",
    chipBackgroundColor: "#eef2f6",
    chipColor: "#344054",
  }),
  [MOODS.GOOD]: Object.freeze({
    label: "good",
    backgroundColor: "#f3fbf5",
    borderColor: "#81c995",
    chipBackgroundColor: "#dcfce7",
    chipColor: "#166534",
  }),
});

export const URGENCY_PRESENTATIONS = Object.freeze({
  [URGENCIES.NO_RUSH]: Object.freeze({
    label: "No rush",
    animationDuration: null,
    backgroundColor: "#eef2f6",
    color: "#344054",
  }),
  [URGENCIES.URGENT]: Object.freeze({
    label: "Urgent",
    animationDuration: "1s",
    backgroundColor: "#fef0c7",
    color: "#7a2e0e",
  }),
  [URGENCIES.EMERGENCY]: Object.freeze({
    label: "Emergency",
    animationDuration: "0.5s",
    backgroundColor: "#fee4e2",
    color: "#912018",
  }),
});

export function noticePresentation({ mood, urgency } = {}) {
  return {
    mood: MOOD_PRESENTATIONS[mood] ?? MOOD_PRESENTATIONS[MOODS.NORMAL],
    urgency: URGENCY_PRESENTATIONS[urgency] ?? URGENCY_PRESENTATIONS[URGENCIES.NO_RUSH],
  };
}
