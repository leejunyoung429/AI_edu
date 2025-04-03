"use client";

import { useState, useCallback, useEffect } from "react";
import { Chat, Message } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

// UUID 패키지가 없어서 자체적으로 간단한 ID 생성 함수를 만들었습니다
const generateId = () => Math.random().toString(36).substring(2, 10);

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 채팅 데이터 불러오기
  useEffect(() => {
    const savedChats = localStorage.getItem("chats");
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats);
        // Date 객체로 변환
        const chatsWithDates = parsedChats.map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setChats(chatsWithDates);

        // 마지막 채팅 선택
        if (chatsWithDates.length > 0) {
          const lastChat = chatsWithDates[0];
          setCurrentChat(lastChat);
          setMessages(lastChat.messages);
        }
      } catch (error) {
        console.error("채팅 데이터를 불러오는 중 오류 발생:", error);
      }
    }
  }, []);

  // 채팅 데이터 저장
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }, [chats]);

  // 새 채팅 생성
  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: generateId(),
      title: "새 대화",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };

    setChats((prevChats) => [newChat, ...prevChats]);
    setCurrentChat(newChat);
    setMessages([]);
    setInput("");
  }, []);

  // 채팅 선택
  const selectChat = useCallback(
    (chatId: string) => {
      const selected = chats.find((chat) => chat.id === chatId);
      if (selected) {
        setCurrentChat(selected);
        setMessages(selected.messages);
      }
    },
    [chats]
  );

  // 채팅 삭제
  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prevChats) => {
        const filteredChats = prevChats.filter((chat) => chat.id !== chatId);

        // 현재 선택된 채팅이 삭제된 경우 다른 채팅 선택
        if (currentChat?.id === chatId) {
          if (filteredChats.length > 0) {
            const newSelected = filteredChats[0];
            setCurrentChat(newSelected);
            setMessages(newSelected.messages);
          } else {
            setCurrentChat(null);
            setMessages([]);
          }
        }

        return filteredChats;
      });
    },
    [currentChat]
  );

  // 입력 변경 처리
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  // 메시지 전송 처리
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (!input.trim() || isLoading) return;

      // 사용자 메시지 생성
      const userMessage: Message = {
        id: generateId(),
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
      };

      // 새 채팅인 경우 제목 설정
      let updatedChat: Chat;
      if (currentChat) {
        updatedChat = {
          ...currentChat,
          title:
            currentChat.messages.length === 0
              ? input.trim().slice(0, 30)
              : currentChat.title,
          updatedAt: new Date(),
          messages: [...currentChat.messages, userMessage],
        };
      } else {
        updatedChat = {
          id: generateId(),
          title: input.trim().slice(0, 30),
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [userMessage],
        };
        setCurrentChat(updatedChat);
      }

      // UI 업데이트
      const newMessages = [...updatedChat.messages];
      setMessages(newMessages);
      setInput("");

      // 채팅 목록 업데이트
      setChats((prevChats) => {
        const otherChats = prevChats.filter(
          (chat) => chat.id !== updatedChat.id
        );
        return [updatedChat, ...otherChats];
      });

      // AI 응답 시뮬레이션 (실제로는 API 호출)
      setIsLoading(true);

      try {
        // 1~2초 딜레이 (실제 API 호출 시뮬레이션)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 + Math.random() * 1000)
        );

        const aiResponse: Message = {
          id: generateId(),
          role: "assistant",
          content: `안녕하세요! "${input.trim()}"에 대한 답변입니다. 이것은 시뮬레이션된 응답입니다.`,
          timestamp: new Date(),
        };

        // 최종 채팅 업데이트
        const finalChat = {
          ...updatedChat,
          updatedAt: new Date(),
          messages: [...updatedChat.messages, aiResponse],
        };

        setMessages([...updatedChat.messages, aiResponse]);
        setCurrentChat(finalChat);

        // 채팅 목록 업데이트
        setChats((prevChats) => {
          const otherChats = prevChats.filter(
            (chat) => chat.id !== finalChat.id
          );
          return [finalChat, ...otherChats];
        });
      } catch (error) {
        console.error("AI 응답을 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [currentChat, input, isLoading]
  );

  return {
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
  };
}
