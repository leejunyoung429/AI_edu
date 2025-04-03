"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Student,
  LearningProgress,
  StudentQuestion,
  LearningPlan,
} from "@/lib/teacher-types";
import { format } from "date-fns";
import {
  Menu,
  BookOpen,
  HelpCircle,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface StudentDashboardProps {
  student: Student;
  progress: () => LearningProgress[];
  questions: () => StudentQuestion[];
  plans: () => LearningPlan[];
  onToggleSidebar: () => void;
}

export function StudentDashboard({
  student,
  progress,
  questions,
  plans,
  onToggleSidebar,
}: StudentDashboardProps) {
  // 데이터 가져오기
  const progressData = progress();
  const questionData = questions();
  const planData = plans();

  // 미답변 질문 수 계산
  const unansweredQuestionsCount = questionData.filter(
    (q) => !q.answered
  ).length;

  // 전체 평균 점수 계산
  const averageScore =
    progressData.length > 0
      ? Math.round(
          progressData.reduce((sum, p) => sum + p.averageScore, 0) /
            progressData.length
        )
      : 0;

  // 학생 전체 진도율 계산
  const totalProgress =
    progressData.length > 0
      ? Math.round(
          (progressData.reduce(
            (sum, p) => sum + p.completedTopics / p.totalTopics,
            0
          ) /
            progressData.length) *
            100
        )
      : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* 헤더 */}
      <header className="flex items-center justify-between border-b p-4 sticky top-0 bg-background z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={onToggleSidebar}
            aria-label="사이드바 토글"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
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
              <h1 className="text-xl font-semibold">{student.name}</h1>
              <p className="text-sm text-muted-foreground">
                {student.grade} {student.class}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            피드백 작성
          </Button>
          <Button size="sm">학습 계획 추가</Button>
        </div>
      </header>

      {/* 학생 질문 기반 세부 특기사항 초안 */}
      <div className="p-4 border-b">
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">
                {student.name} 학생 세부 특기사항 초안
              </CardTitle>
              <Badge
                variant="outline"
                className="border-indigo-400 text-indigo-500"
              >
                AI 추천
              </Badge>
            </div>
            <CardDescription>
              학생의 질문 패턴과 학습 진도를 분석하여 생성된 세부 특기사항
              초안입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questionData.length === 0 ? (
              <div className="text-muted-foreground text-sm italic">
                아직 충분한 데이터가 없습니다. 더 많은 학습 활동이 기록되면
                특기사항 초안이 생성됩니다.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm bg-background p-3 rounded-md border">
                  {student.name} 학생은{" "}
                  {progressData.map((p) => p.subject).join(", ")} 과목에 관심을
                  보이고 있으며, 특히{" "}
                  {questionData.length > 0 ? questionData[0].subject : "교과"}{" "}
                  영역에서 심층적인 학습 의지를 보여줍니다.
                  {questionData.filter((q) => !q.answered).length > 0
                    ? ` 최근 ${
                        questionData.filter((q) => !q.answered)[0].topic
                      }에 대한 심화 질문을 통해 해당 분야에 호기심을 드러냈습니다.`
                    : ""}
                </div>

                <div className="text-sm bg-background p-3 rounded-md border">
                  {progressData.length > 0 &&
                  progressData.some((p) => p.averageScore > 90)
                    ? `${
                        progressData.filter((p) => p.averageScore > 90)[0]
                          .subject
                      } 분야에서 뛰어난 성취도(${
                        progressData.filter((p) => p.averageScore > 90)[0]
                          .averageScore
                      }점)를 보여주고 있으며, `
                    : "전반적인 학습 과정에서 "}
                  {questionData.length > 1
                    ? `${questionData[0].topic}와 ${questionData[1].topic} 주제에 관련된 질문을 통해 깊이 있는 사고력을 발휘하고 있습니다.`
                    : "꾸준한 학습 의지를 보여주고 있습니다."}
                </div>

                <div className="text-sm bg-background p-3 rounded-md border">
                  향후 {planData.length > 0 ? planData[0].subject : "주요 과목"}
                  에서 심화 학습을 통해 더 높은 성취를 이룰 수 있도록 지도하면
                  좋을 것으로 보입니다.
                </div>
              </div>
            )}
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" size="sm">
                수정하기
              </Button>
              <Button size="sm">특기사항에 반영</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              전체 진도율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <Progress value={totalProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              평균 점수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}</div>
            <div className="text-xs text-muted-foreground mt-2">
              전체 과목 평균
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              미답변 질문
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unansweredQuestionsCount}</div>
            <div className="text-xs text-muted-foreground mt-2">
              총 {questionData.length}개 질문 중
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-4">
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="progress" className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              과목별 진도
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2" />
              질문 내역
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              학습 계획
            </TabsTrigger>
          </TabsList>

          {/* 과목별 진도 탭 */}
          <TabsContent value="progress" className="space-y-4">
            {progressData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground">진도 정보가 없습니다</p>
              </div>
            ) : (
              progressData.map((item) => (
                <Card key={item.subjectId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{item.subject}</CardTitle>
                      <Badge variant="outline">{item.averageScore}점</Badge>
                    </div>
                    <CardDescription>
                      최근 활동:{" "}
                      {format(new Date(item.lastActivity), "yyyy-MM-dd")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">
                        진도율:{" "}
                        {Math.round(
                          (item.completedTopics / item.totalTopics) * 100
                        )}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.completedTopics}/{item.totalTopics} 주제 완료
                      </div>
                    </div>
                    <Progress
                      value={(item.completedTopics / item.totalTopics) * 100}
                      className="h-2"
                    />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 질문 내역 탭 */}
          <TabsContent value="questions" className="space-y-4">
            {questionData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground">질문 내역이 없습니다</p>
              </div>
            ) : (
              questionData.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">
                        {item.question}
                      </CardTitle>
                      <Badge variant={item.answered ? "outline" : "default"}>
                        {item.answered ? "답변완료" : "미답변"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {item.subject} &gt; {item.topic} |{" "}
                      {format(new Date(item.timestamp), "yyyy-MM-dd")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        {item.answered ? "답변 보기" : "답변하기"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* 학습 계획 탭 */}
          <TabsContent value="plans" className="space-y-4">
            {planData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-muted-foreground">학습 계획이 없습니다</p>
              </div>
            ) : (
              planData.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <Badge
                        variant={
                          item.status === "completed"
                            ? "outline"
                            : item.status === "in_progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {item.status === "completed"
                          ? "완료됨"
                          : item.status === "in_progress"
                          ? "진행중"
                          : "시작전"}
                      </Badge>
                    </div>
                    <CardDescription>
                      {item.subject} |{" "}
                      {format(new Date(item.startDate), "yyyy-MM-dd")} ~{" "}
                      {format(new Date(item.endDate), "yyyy-MM-dd")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{item.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm">진행도: {item.progress}%</div>
                      <div className="flex items-center text-sm">
                        {item.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        ) : item.status === "not_started" ? (
                          <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                        ) : null}
                        <span>
                          {format(new Date(item.endDate), "MM/dd")}까지
                        </span>
                      </div>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
