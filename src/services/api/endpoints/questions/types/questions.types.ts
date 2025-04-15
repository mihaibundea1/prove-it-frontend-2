export type AnswerType = "single" | "multiple" | "text";

export interface Question {
  _id: string; // MongoDB ObjectId as a string
  question_id: string; // Unique question identifier
  question: string; // The question text
  options: string[]; // Array of answer choices (empty for text answers)
  answer_type: AnswerType; // "single", "multiple", or "text"
  created_at: string; // ISO formatted date string
  updated_at: string; // ISO formatted date string
}

// User response to a question
export interface Response {
  question_id: string; // The unique identifier for the question
  question_text: string; // The text of the question (added field)
  answer: string[]; // Always an array (single-choice or multiple-choice)
  timestamp: string; // ISO formatted timestamp
}

// Structure for versioned questions stored in MongoDB
export interface VersionedQuestions {
  version: number;
  date: string; // ISO formatted date
  questions: Question[];
}
