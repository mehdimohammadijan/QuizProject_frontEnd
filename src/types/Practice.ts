import { Question } from './Question'
export interface Practice {
  title: string;
  description: string;
}
export interface FullDetailPractice {
  opt: string;
  id: string;
  title: string;
  description: string;
}
export interface SelectedQuiz {
  id: string;
  title: string;
}
export interface RecievedQuiz {
  id: string;
  title: string;
  description: string;
  createAt: Date;
}

export interface AssignedQuiz {
  id: string;
  email: string;
  quiz: string;
  quizId: string;
}

export interface UpdateAssignedQuiz {
  email: string;
  quiz: string;
  quizId: string;
  opt: string;
}
export interface AssignedUserQuiz {
  id: string;
  email: string;
  practices: {
    id: string;
    createdAt: string;
    practice: {
      id: string;
      title: string;
      description: string;
      createdAt: string;
    };
  }[];
}
export interface CurrentPractice {
  createdAt: string;
  description: string;
  id: string;
  title: string;
  questions: Question[];
}
