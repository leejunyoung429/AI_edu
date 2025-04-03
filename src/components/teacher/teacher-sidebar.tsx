"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Student } from "@/lib/teacher-types";
import { Avatar } from "@/components/ui/avatar";
import { Search, Menu, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TeacherSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  students: Student[];
  selectedStudentId: string | undefined;
  onStudentSelect: (studentId: string) => void;
}

export function TeacherSidebar({
  isOpen,
  onToggle,
  students,
  selectedStudentId,
  onStudentSelect,
}: TeacherSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50"
        onClick={onToggle}
        aria-label="사이드바 열기"
      >
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  // 검색어로 학생 필터링
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed top-0 left-0 h-full w-[250px] border-r z-10 bg-background flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">학생 관리</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="사이드바 닫기"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="학생 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredStudents.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`group flex items-center p-2 rounded-md cursor-pointer ${
                    student.id === selectedStudentId
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => onStudentSelect(student.id)}
                  tabIndex={0}
                  role="button"
                  aria-selected={student.id === selectedStudentId}
                  aria-label={`${student.name} 학생 선택하기`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onStudentSelect(student.id);
                    }
                  }}
                >
                  <Avatar className="h-9 w-9 mr-3">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
                        {student.name.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {student.grade} {student.class}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <p className="text-xs text-center text-muted-foreground">
          1학년 3반 학생 명단
        </p>
      </div>
    </div>
  );
}
