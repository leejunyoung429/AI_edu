"use client";

import { Avatar } from "@/components/ui/avatar";
import { Message } from "@/lib/types";
import { format } from "date-fns";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex ${
          isUser ? "flex-row-reverse" : "flex-row"
        } gap-3 max-w-[80%]`}
      >
        {/* 아바타 */}
        <Avatar className="h-8 w-8 mt-1">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
            {isUser ? "나" : "AI"}
          </div>
        </Avatar>

        {/* 메시지 내용 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">
              {isUser ? "나" : "AI 어시스턴트"}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.timestamp), "HH:mm")}
            </span>
          </div>

          <div
            className={`p-3 rounded-lg ${
              isUser ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {message.content.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
