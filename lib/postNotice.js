import { DEFAULT_CLASSIFICATION, isClassification } from "./classificationContract.js";
import { normalizeNoticeText } from "./noticeContract.js";

export function createPostNotice({ classify, query, revalidate, logger = console }) {
  return async function postNotice(_previousState, formData) {
    let text;
    try {
      text = normalizeNoticeText(formData.get("text"));
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Enter a valid notice.",
      };
    }

    let classification = DEFAULT_CLASSIFICATION;
    try {
      const result = await classify(text);
      if (isClassification(result)) classification = result;
    } catch {
      logger.warn("Notice classification failed; using defaults.");
    }

    try {
      await query(
        "INSERT INTO notices (text, mood, urgency) VALUES ($1, $2, $3)",
        [text, classification.mood, classification.urgency]
      );
      revalidate("/");
      return { status: "success", message: "" };
    } catch (error) {
      logger.error("Notice insert failed.", {
        error: error instanceof Error ? error.name : "UnknownError",
      });
      return {
        status: "error",
        message: "We couldn't post your notice. Please try again.",
      };
    }
  };
}
