export interface Course {
  id: number;
  name: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  courses: Course[];
  challengeCount: number;
}

export interface SubjectDetail {
  id: number;
  name: string;
  description: string;
  courses: Course[];
  stats: { total: number; easy: number; medium: number; hard: number };
}

export interface SubjectChallenge {
  id: number;
  title: string;
  description: string;
  dificulty: { id: number; name: string };
  language: { id: number; name: string };
  completedCount: number;
}

export interface SubjectChallengesResponse {
  data: SubjectChallenge[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}
