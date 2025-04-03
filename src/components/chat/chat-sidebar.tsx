"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Chat } from "@/lib/types";
import { format } from "date-fns";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chats: Chat[];
  currentChatId: string | undefined;
  onChatSelect: (chatId: string) => void;
  onChatCreate: () => void;
  onChatDelete: (chatId: string) => void;
}

export function ChatSidebar({
  isOpen,
  chats,
  currentChatId,
  onChatSelect,
  onChatCreate,
  onChatDelete,
}: ChatSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 h-full w-[250px] border-r z-10 bg-background flex flex-col">
      <div className="p-4 border-b">
        <Button
          className="w-full"
          onClick={onChatCreate}
          aria-label="새 채팅 만들기"
        >
          <PlusIcon className="h-4 w-4 mr-2" />새 채팅
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>저장된 대화가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center justify-between p-2 rounded-md text-sm cursor-pointer ${
                    chat.id === currentChatId
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => onChatSelect(chat.id)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${chat.title} 대화 선택하기`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onChatSelect(chat.id);
                    }
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="truncate font-medium">{chat.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(chat.updatedAt), "MM/dd HH:mm")}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChatDelete(chat.id);
                    }}
                    aria-label={`${chat.title} 대화 삭제하기`}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t text-xs text-center text-muted-foreground">
        채팅은 브라우저에 저장됩니다
      </div>
    </div>
  );
}
