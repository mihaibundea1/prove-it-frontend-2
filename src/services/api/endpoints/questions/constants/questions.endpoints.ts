// services/api/endpoints/questions/constants/questions.endpoints.ts
export const QUESTIONS_ENDPOINTS = {
    BASE: '/questions', // Fetch latest questions (GET /questions)
    SUBMIT: '/submit_answers', //Submit answers to questions (POST /questions/submit_answers)
  } as const;
  