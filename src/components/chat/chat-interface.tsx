"use client";

import { FormEvent, useRef, useEffect } from "react";
import { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageItem } from "./message-item";
import { ArrowUpIcon, Menu } from "lucide-react";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e?: FormEvent) => void;
  onToggleSidebar: () => void;
}

export function ChatInterface({
  messages,
  isLoading,
  input,
  onInputChange,
  onSubmit,
  onToggleSidebar,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 메시지 추가될 때마다 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enter키로 전송 처리 (Shift+Enter는 줄바꿈)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <header className="flex items-center border-b p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label="메뉴 토글"
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">AI 챗봇</h1>
      </header>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">
              AI 어시스턴트와 대화하기
            </h2>
            <p className="max-w-md">질문을 입력하고 AI와 대화를 시작하세요.</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}

        {isLoading && (
          <div className="flex items-center space-x-2 text-muted-foreground animate-pulse">
            <span>AI가 응답하는 중...</span>
            <div className="h-2 w-2 rounded-full bg-current"></div>
            <div
              className="h-2 w-2 rounded-full bg-current"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="h-2 w-2 rounded-full bg-current"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 폼 */}
      <div className="border-t p-4">
        <form onSubmit={onSubmit} className="flex items-end space-x-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              className="min-h-[80px] resize-none pr-12 py-3"
              maxLength={4000}
              aria-label="메시지 입력"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="absolute bottom-2 right-2"
              aria-label="전송"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Enter 키로 보내기. Shift+Enter 키로 줄바꿈.
        </p>
      </div>
    </div>
  );
}
