import {
  Student,
  LearningProgress,
  StudentQuestion,
  LearningPlan,
} from "./teacher-types";

export interface TodoItem {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  subject?: string;
  dueDate?: Date;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  subject?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: "assignment" | "exam" | "study" | "other";
}

export interface StudentStats {
  completedTasks: number;
  totalTasks: number;
  upcomingDeadlines: number;
  studyStreakDays: number;
}
