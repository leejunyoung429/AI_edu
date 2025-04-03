"use client";

import { useState } from "react";
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar";
import { StudentDashboard } from "@/components/teacher/student-dashboard";
import { useStudents } from "@/hooks/use-students";

export default function TeacherPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    students,
    selectedStudent,
    selectStudent,
    studentProgress,
    studentQuestions,
    studentPlans,
  } = useStudents();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <TeacherSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        students={students}
        selectedStudentId={selectedStudent?.id}
        onStudentSelect={selectStudent}
      />
      <main
        className={`flex-1 flex flex-col h-full transition-all ${
          isSidebarOpen ? "ml-[250px]" : "ml-0"
        }`}
      >
        {selectedStudent ? (
          <StudentDashboard
            student={selectedStudent}
            progress={studentProgress}
            questions={studentQuestions}
            plans={studentPlans}
            onToggleSidebar={toggleSidebar}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-center p-8">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold mb-2">학생을 선택해주세요</h2>
              <p className="text-muted-foreground">
                왼쪽 사이드바에서 학생을 선택하면 해당 학생의 학습 정보를 확인할
                수 있습니다.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
