"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { useChat } from "@/hooks/use-chat";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    chats,
    currentChat,
    messages,
    isLoading,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    createNewChat,
    selectChat,
    deleteChat,
  } = useChat();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chats={chats}
        currentChatId={currentChat?.id}
        onChatSelect={selectChat}
        onChatCreate={createNewChat}
        onChatDelete={deleteChat}
      />
      <main
        className={`flex-1 flex flex-col transition-all ${
          isSidebarOpen ? "ml-[250px]" : "ml-0"
        }`}
      >
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          input={input}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onToggleSidebar={toggleSidebar}
        />
      </main>
    </div>
  );
}
