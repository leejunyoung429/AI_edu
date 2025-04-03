"use client";

import { useState, useCallback, useEffect } from "react";
import { TodoItem, CalendarEvent, StudentStats } from "@/lib/student-types";
import { Student } from "@/lib/teacher-types";

// 샘플 학생 데이터 (실제로는 인증/세션에서 가져옵니다)
const CURRENT_STUDENT: Student = {
  id: "student1",
  name: "김민준",
  grade: "1학년",
  class: "3반",
};

// 샘플 Todo 데이터
const SAMPLE_TODOS: TodoItem[] = [
  {
    id: "todo1",
    studentId: "student1",
    title: "수학 숙제 완료하기",
    description: "이차방정식 연습문제 1-10번",
    subject: "수학",
    dueDate: new Date(2025, 3, 3),
    completed: false,
    priority: "high",
    createdAt: new Date(2025, 3, 3),
  },
  {
    id: "todo2",
    studentId: "student1",
    title: "과학 실험 보고서 작성",
    description: "전자기학 실험 결과 정리",
    subject: "과학",
    dueDate: new Date(2025, 3, 3),
    completed: false,
    priority: "medium",
    createdAt: new Date(2025, 3, 3),
  },
  {
    id: "todo3",
    studentId: "student1",
    title: "영어 단어 외우기",
    description: "Chapter 5 단어 30개",
    subject: "영어",
    dueDate: new Date(2025, 3, 3),
    completed: true,
    priority: "medium",
    createdAt: new Date(2025, 3, 3),
  },
  {
    id: "todo4",
    studentId: "student1",
    title: "국어 독서 감상문 작성",
    description: "토지 1부 읽고 감상문 작성",
    subject: "국어",
    dueDate: new Date(2025, 3, 3),
    completed: false,
    priority: "low",
    createdAt: new Date(2025, 3, 3),
  },
];

// 샘플 일정 데이터
const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: "event1",
    studentId: "student1",
    title: "수학 중간고사",
    description: "이차방정식, 삼각함수 범위",
    subject: "수학",
    startDate: new Date(2023, 8, 25, 9, 0),
    endDate: new Date(2023, 8, 25, 10, 30),
    allDay: false,
    type: "exam",
  },
  {
    id: "event2",
    studentId: "student1",
    title: "과학 보고서 제출",
    description: "전자기학 실험 보고서",
    subject: "과학",
    startDate: new Date(2023, 8, 22),
    endDate: new Date(2023, 8, 22),
    allDay: true,
    type: "assignment",
  },
  {
    id: "event3",
    studentId: "student1",
    title: "자기주도학습 시간",
    description: "수학 문제 풀이",
    subject: "수학",
    startDate: new Date(2023, 8, 20, 16, 0),
    endDate: new Date(2023, 8, 20, 18, 0),
    allDay: false,
    type: "study",
  },
  {
    id: "event4",
    studentId: "student1",
    title: "영어 프레젠테이션",
    description: "환경 문제에 관한 발표",
    subject: "영어",
    startDate: new Date(2023, 8, 28, 13, 0),
    endDate: new Date(2023, 8, 28, 14, 0),
    allDay: false,
    type: "other",
  },
];

export function useStudentDashboard() {
  const [student] = useState<Student>(CURRENT_STUDENT);
  const [todos, setTodos] = useState<TodoItem[]>(SAMPLE_TODOS);
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 통계 정보 계산
  const stats: StudentStats = {
    completedTasks: todos.filter((todo) => todo.completed).length,
    totalTasks: todos.length,
    upcomingDeadlines: todos.filter(
      (todo) =>
        !todo.completed &&
        todo.dueDate &&
        todo.dueDate.getTime() - new Date().getTime() < 48 * 60 * 60 * 1000 // 48시간 이내
    ).length,
    studyStreakDays: 5, // 예시로 5일 연속 공부 중이라고 가정
  };

  // Todo 추가
  const addTodo = useCallback(
    (newTodo: Omit<TodoItem, "id" | "studentId" | "createdAt">) => {
      const todo: TodoItem = {
        ...newTodo,
        id: `todo${todos.length + 1}`,
        studentId: student.id,
        createdAt: new Date(),
      };

      setTodos((prev) => [...prev, todo]);
    },
    [todos, student.id]
  );

  // Todo 수정
  const updateTodo = useCallback((id: string, updates: Partial<TodoItem>) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
    );
  }, []);

  // Todo 삭제
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // 일정 추가
  const addEvent = useCallback(
    (newEvent: Omit<CalendarEvent, "id" | "studentId">) => {
      const event: CalendarEvent = {
        ...newEvent,
        id: `event${events.length + 1}`,
        studentId: student.id,
      };

      setEvents((prev) => [...prev, event]);
    },
    [events, student.id]
  );

  // 일정 수정
  const updateEvent = useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updates } : event
        )
      );
    },
    []
  );

  // 일정 삭제
  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  // 특정 날짜의 Todo 목록
  const getTodosByDate = useCallback(
    (date: Date) => {
      return todos.filter(
        (todo) =>
          todo.dueDate &&
          todo.dueDate.getDate() === date.getDate() &&
          todo.dueDate.getMonth() === date.getMonth() &&
          todo.dueDate.getFullYear() === date.getFullYear()
      );
    },
    [todos]
  );

  // 특정 날짜의 일정 목록
  const getEventsByDate = useCallback(
    (date: Date) => {
      return events.filter(
        (event) =>
          (event.startDate.getDate() === date.getDate() &&
            event.startDate.getMonth() === date.getMonth() &&
            event.startDate.getFullYear() === date.getFullYear()) ||
          (event.allDay && event.startDate <= date && event.endDate >= date)
      );
    },
    [events]
  );

  return {
    student,
    todos,
    events,
    stats,
    selectedDate,
    setSelectedDate,
    addTodo,
    updateTodo,
    deleteTodo,
    addEvent,
    updateEvent,
    deleteEvent,
    getTodosByDate,
    getEventsByDate,
  };
}
