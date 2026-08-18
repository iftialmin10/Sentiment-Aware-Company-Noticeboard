export const MAX_NOTICE_LENGTH = 1_000;

export function normalizeNoticeText(value) {
  if (typeof value !== "string") {
    throw new TypeError("Notice text must be a string.");
  }

  const text = value.trim();

  if (text.length === 0) {
    throw new Error("Notice text is required.");
  }

  if (text.length > MAX_NOTICE_LENGTH) {
    throw new Error(
      `Notice text must be ${MAX_NOTICE_LENGTH} characters or fewer.`
    );
  }

  return text;
}
