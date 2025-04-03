"use client";

import { useState } from "react";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";
import { TodoItem } from "@/components/student/todo-item";
import { EventItem } from "@/components/student/event-item";
import { Calendar } from "@/components/ui/calendar";
import { TodoItem as TodoItemType, CalendarEvent } from "@/lib/student-types";
import { format, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CheckCircle2,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Star,
  ListTodo,
  BarChart2,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export function StudentDashboard() {
  const {
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
  } = useStudentDashboard();

  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // 날짜에 이벤트나 Todo가 있는지 확인
  const hasDateItems = (date: Date) => {
    const hasTodos = todos.some(
      (todo) => todo.dueDate && isSameDay(todo.dueDate, date)
    );

    const hasEvents = events.some(
      (event) =>
        isSameDay(event.startDate, date) ||
        (event.allDay && event.startDate <= date && event.endDate >= date)
    );

    return hasTodos || hasEvents;
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTodo(id, { completed });
  };

  const handleEditTodo = (id: string) => {
    // Todo 편집 기능 추가 예정
    console.log("Edit todo", id);
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo(id);
  };

  const selectedTodos = getTodosByDate(selectedDate);
  const selectedEvents = getEventsByDate(selectedDate);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b p-4 sticky top-0 bg-background z-10">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground">
              {student.name.charAt(0)}
            </div>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">
              {student.name} 학생의 자기주도학습
            </h1>
            <p className="text-sm text-muted-foreground">
              {student.grade} {student.class}
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => (window.location.href = "/chat")}
          >
            <MessageSquare className="h-4 w-4" />
            AI 학습 도우미
          </Button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {/* 왼쪽: 통계 및 탭 */}
        <div className="md:col-span-2 space-y-4">
          {/* 학습 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> 완료한 과제
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTasks}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  총 {stats.totalTasks}개 중
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="mr-1 h-4 w-4" /> 마감 임박
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.upcomingDeadlines}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  48시간 이내
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Star className="mr-1 h-4 w-4" /> 학습 스트릭
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.studyStreakDays}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  연속 학습일
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <BarChart2 className="mr-1 h-4 w-4" /> 완료율
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalTasks
                    ? Math.round(
                        (stats.completedTasks / stats.totalTasks) * 100
                      )
                    : 0}
                  %
                </div>
                <Progress
                  value={
                    stats.totalTasks
                      ? (stats.completedTasks / stats.totalTasks) * 100
                      : 0
                  }
                  className="h-2 mt-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* 탭 콘텐츠 */}
          <Tabs defaultValue="todo" className="w-full">
            <div className="flex justify-between items-center mb-3">
              <TabsList>
                <TabsTrigger value="todo" className="flex items-center">
                  <ListTodo className="h-4 w-4 mr-2" />할 일 목록
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  학습 일정
                </TabsTrigger>
              </TabsList>

              <Button
                size="sm"
                className="gap-1"
                onClick={() => setIsAddingTodo(true)}
              >
                <Plus className="h-4 w-4" />
                추가하기
              </Button>
            </div>

            <TabsContent value="todo" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>자기주도학습 할 일</CardTitle>
                  <CardDescription>
                    관리해야 할 과제와 학습 태스크를 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {todos.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>등록된 할 일이 없습니다</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setIsAddingTodo(true)}
                          >
                            새 할 일 추가하기
                          </Button>
                        </div>
                      ) : (
                        todos.map((todo) => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggleComplete={handleToggleComplete}
                            onEdit={handleEditTodo}
                            onDelete={handleDeleteTodo}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>학습 일정</CardTitle>
                  <CardDescription>
                    시험, 과제 마감 및 학습 계획을 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>등록된 일정이 없습니다</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setIsAddingEvent(true)}
                          >
                            새 일정 추가하기
                          </Button>
                        </div>
                      ) : (
                        events.map((event) => (
                          <EventItem key={event.id} event={event} />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 오른쪽: 달력 및 선택된 날짜 항목 */}
        <div className="md:col-span-1 lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>학습 달력</CardTitle>
              <CardDescription>
                일정과 할 일이 있는 날짜는 강조 표시됩니다
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="flex justify-center items-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="w-full"
                  locale={ko}
                  modifiersClassNames={{
                    selected: "bg-primary text-primary-foreground",
                    today: "bg-accent text-accent-foreground",
                  }}
                  modifiers={{
                    highlighted: (date) => hasDateItems(date),
                  }}
                  modifiersStyles={{
                    highlighted: {
                      fontWeight: "bold",
                      textDecoration: "underline",
                      color: "var(--primary)",
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 선택된 날짜 항목 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                {format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })}
              </CardTitle>
              <CardDescription>선택한 날짜의 할 일과 일정</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedTodos.length === 0 && selectedEvents.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>이 날짜에는 등록된 항목이 없습니다</p>
                  </div>
                ) : (
                  <>
                    {selectedTodos.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <ListTodo className="mr-1 h-4 w-4 text-primary" /> 할
                          일
                        </h3>
                        <div className="space-y-2">
                          {selectedTodos.map((todo) => (
                            <TodoItem
                              key={todo.id}
                              todo={todo}
                              onToggleComplete={handleToggleComplete}
                              onEdit={handleEditTodo}
                              onDelete={handleDeleteTodo}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEvents.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2 flex items-center">
                          <CalendarIcon className="mr-1 h-4 w-4 text-primary" />{" "}
                          일정
                        </h3>
                        <div className="space-y-2">
                          {selectedEvents.map((event) => (
                            <EventItem key={event.id} event={event} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
