export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  profileImage?: string;
}

export interface LearningProgress {
  studentId: string;
  subjectId: string;
  subject: string;
  completedTopics: number;
  totalTopics: number;
  lastActivity: Date;
  averageScore: number;
}

export interface StudentQuestion {
  id: string;
  studentId: string;
  question: string;
  subject: string;
  topic: string;
  timestamp: Date;
  answered: boolean;
}

export interface LearningPlan {
  id: string;
  studentId: string;
  title: string;
  description: string;
  subject: string;
  startDate: Date;
  endDate: Date;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
}

export interface Feedback {
  id: string;
  studentId: string;
  content: string;
  date: Date;
  teacherId: string;
}
