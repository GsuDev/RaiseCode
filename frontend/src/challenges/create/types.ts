export interface ChallengeFormState {
  title: string;
  description: string;       // descripción breve — campo description del backend
  statement: string;         // enunciado completo Markdown — campo statement del backend
  languageId: number | null;
  subjectId: number | null;
  dificultyId: number | null;
  tests: TestCase[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface SelectOption {
  id: number;
  name: string;
}

export const EMPTY_FORM: ChallengeFormState = {
  title: '',
  description: '',
  statement: '',
  languageId: null,
  subjectId: null,
  dificultyId: null,
  tests: [
    { id: crypto.randomUUID(), input: '', expectedOutput: '' },
    { id: crypto.randomUUID(), input: '', expectedOutput: '' },
  ],
};
