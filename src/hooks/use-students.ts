"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Student,
  LearningProgress,
  StudentQuestion,
  LearningPlan,
} from "@/lib/teacher-types";

// 샘플 학생 데이터
const SAMPLE_STUDENTS: Student[] = [
  {
    id: "student1",
    name: "김민준",
    grade: "1학년",
    class: "3반",
  },
  {
    id: "student2",
    name: "이서연",
    grade: "1학년",
    class: "3반",
  },
  {
    id: "student3",
    name: "박지훈",
    grade: "1학년",
    class: "3반",
  },
  {
    id: "student4",
    name: "최수아",
    grade: "1학년",
    class: "3반",
  },
  {
    id: "student5",
    name: "정도윤",
    grade: "1학년",
    class: "3반",
  },
];

// 샘플 진도 데이터
const SAMPLE_PROGRESS: Record<string, LearningProgress[]> = {
  student1: [
    {
      studentId: "student1",
      subjectId: "math",
      subject: "수학",
      completedTopics: 15,
      totalTopics: 20,
      lastActivity: new Date(2023, 8, 15),
      averageScore: 92,
    },
    {
      studentId: "student1",
      subjectId: "science",
      subject: "과학",
      completedTopics: 12,
      totalTopics: 18,
      lastActivity: new Date(2023, 8, 14),
      averageScore: 88,
    },
    {
      studentId: "student1",
      subjectId: "korean",
      subject: "국어",
      completedTopics: 10,
      totalTopics: 15,
      lastActivity: new Date(2023, 8, 13),
      averageScore: 94,
    },
  ],
  student2: [
    {
      studentId: "student2",
      subjectId: "math",
      subject: "수학",
      completedTopics: 18,
      totalTopics: 20,
      lastActivity: new Date(2023, 8, 15),
      averageScore: 95,
    },
    {
      studentId: "student2",
      subjectId: "science",
      subject: "과학",
      completedTopics: 14,
      totalTopics: 18,
      lastActivity: new Date(2023, 8, 12),
      averageScore: 91,
    },
  ],
  student3: [
    {
      studentId: "student3",
      subjectId: "math",
      subject: "수학",
      completedTopics: 10,
      totalTopics: 20,
      lastActivity: new Date(2023, 8, 10),
      averageScore: 80,
    },
  ],
  student4: [
    {
      studentId: "student4",
      subjectId: "korean",
      subject: "국어",
      completedTopics: 14,
      totalTopics: 15,
      lastActivity: new Date(2023, 8, 15),
      averageScore: 92,
    },
  ],
  student5: [
    {
      studentId: "student5",
      subjectId: "science",
      subject: "과학",
      completedTopics: 16,
      totalTopics: 18,
      lastActivity: new Date(2023, 8, 14),
      averageScore: 89,
    },
  ],
};

// 샘플 질문 데이터
const SAMPLE_QUESTIONS: Record<string, StudentQuestion[]> = {
  student1: [
    {
      id: "q1",
      studentId: "student1",
      question: "이차방정식의 근의 공식을 어떻게 유도하나요?",
      subject: "수학",
      topic: "이차방정식",
      timestamp: new Date(2023, 8, 14),
      answered: true,
    },
    {
      id: "q2",
      studentId: "student1",
      question: "뉴턴의 제 3법칙은 무엇인가요?",
      subject: "과학",
      topic: "힘과 운동",
      timestamp: new Date(2023, 8, 13),
      answered: false,
    },
  ],
  student2: [
    {
      id: "q3",
      studentId: "student2",
      question: "미분과 적분의 차이점은 무엇인가요?",
      subject: "수학",
      topic: "미적분",
      timestamp: new Date(2023, 8, 15),
      answered: false,
    },
  ],
  student3: [
    {
      id: "q4",
      studentId: "student3",
      question: "DNA의 구조는 어떻게 되나요?",
      subject: "과학",
      topic: "생명과학",
      timestamp: new Date(2023, 8, 10),
      answered: true,
    },
  ],
  student4: [
    {
      id: "q5",
      studentId: "student4",
      question: "문학 작품에서 상징의 역할은 무엇인가요?",
      subject: "국어",
      topic: "문학",
      timestamp: new Date(2023, 8, 14),
      answered: true,
    },
  ],
  student5: [
    {
      id: "q6",
      studentId: "student5",
      question: "화학 반응에서 촉매의 역할은 무엇인가요?",
      subject: "과학",
      topic: "화학",
      timestamp: new Date(2023, 8, 13),
      answered: false,
    },
  ],
};

// 샘플 학습 계획 데이터
const SAMPLE_PLANS: Record<string, LearningPlan[]> = {
  student1: [
    {
      id: "plan1",
      studentId: "student1",
      title: "수학 중간고사 준비",
      description: "이차방정식, 삼각함수 중점 학습",
      subject: "수학",
      startDate: new Date(2023, 8, 10),
      endDate: new Date(2023, 9, 10),
      status: "in_progress",
      progress: 60,
    },
    {
      id: "plan2",
      studentId: "student1",
      title: "과학 실험 보고서 작성",
      description: "물리 전자기학 실험 보고서",
      subject: "과학",
      startDate: new Date(2023, 8, 15),
      endDate: new Date(2023, 8, 20),
      status: "not_started",
      progress: 0,
    },
  ],
  student2: [
    {
      id: "plan3",
      studentId: "student2",
      title: "수학 심화 학습",
      description: "미적분과 벡터 심화 문제 풀이",
      subject: "수학",
      startDate: new Date(2023, 8, 5),
      endDate: new Date(2023, 9, 5),
      status: "in_progress",
      progress: 80,
    },
  ],
  student3: [
    {
      id: "plan4",
      studentId: "student3",
      title: "수학 기초 다지기",
      description: "방정식과 함수의 기초 개념 학습",
      subject: "수학",
      startDate: new Date(2023, 8, 1),
      endDate: new Date(2023, 9, 1),
      status: "in_progress",
      progress: 40,
    },
  ],
  student4: [
    {
      id: "plan5",
      studentId: "student4",
      title: "국어 논술 준비",
      description: "논술 기초와 예시 분석",
      subject: "국어",
      startDate: new Date(2023, 8, 10),
      endDate: new Date(2023, 9, 10),
      status: "completed",
      progress: 100,
    },
  ],
  student5: [
    {
      id: "plan6",
      studentId: "student5",
      title: "과학 프로젝트 준비",
      description: "생태계 조사 프로젝트",
      subject: "과학",
      startDate: new Date(2023, 8, 15),
      endDate: new Date(2023, 9, 15),
      status: "in_progress",
      progress: 30,
    },
  ],
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>(SAMPLE_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // 학생 선택
  const selectStudent = useCallback(
    (studentId: string) => {
      const student = students.find((s) => s.id === studentId);
      setSelectedStudent(student || null);
    },
    [students]
  );

  // 선택된 학생의 진도 정보
  const studentProgress = useCallback(() => {
    if (!selectedStudent) return [];
    return SAMPLE_PROGRESS[selectedStudent.id] || [];
  }, [selectedStudent]);

  // 선택된 학생의 질문 목록
  const studentQuestions = useCallback(() => {
    if (!selectedStudent) return [];
    return SAMPLE_QUESTIONS[selectedStudent.id] || [];
  }, [selectedStudent]);

  // 선택된 학생의 학습 계획
  const studentPlans = useCallback(() => {
    if (!selectedStudent) return [];
    return SAMPLE_PLANS[selectedStudent.id] || [];
  }, [selectedStudent]);

  return {
    students,
    selectedStudent,
    selectStudent,
    studentProgress,
    studentQuestions,
    studentPlans,
  };
}
