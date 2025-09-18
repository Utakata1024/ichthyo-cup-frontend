"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import { Message } from "@/components/MessageBubble";

const CHAT_MESSAGES_KEY = "chatMessages";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 初期化時にlocalStorageからメッセージを読み込む
  const isInitialMount = useRef(true);

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem(CHAT_MESSAGES_KEY);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error(
        "localStorageからのメッセージの読み込みに失敗しました:",
        error
      );
    }
  }, []);

  useEffect(() => {
    // マウントが完了していない、またはmessagesが初期状態のままであれば何もしない
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("localStorageへのメッセージの保存に失敗しました:", error);
    }
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    const element = chatContainerRef.current;
    if (!element) return;

    const scrollToBottom = () => {
      element.scrollTop = element.scrollHeight;
    };

    const lastMessage = messages[messages.length - 1];
    const isAnimating = lastMessage?.sender === "ai" && lastMessage.isAnimation;

    if (isAnimating) {
      const intervalId = setInterval(scrollToBottom, 100);
      return () => clearInterval(intervalId);
    } else {
      element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
      isAnimation: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 1回目：classify
      const classifyResponse = await fetch(
        "http://127.0.0.1:4000/api/tool/classify-spotify-query-search",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        }
      );
      const classifyData = await classifyResponse.json();
      const classifiedText = classifyData.content?.[0]?.text;
      if (!classifiedText) throw new Error("分類結果がありません");

      let parsed;
      try {
        parsed = JSON.parse(classifiedText); // ← JSON配列として解釈
      } catch {
        throw new Error("分類結果のJSONパースに失敗しました");
      }

      // 1件目だけを利用（複数返る場合もある）
      const first = parsed[0];
      if (!first?.type || !first?.keyword) {
        throw new Error("分類結果が不正です");
      }

      // 2回目：search
      const searchResponse = await fetch(
        "http://127.0.0.1:4000/api/tool/search-spotify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: first.type, keyword: first.keyword }),
        }
      );
      const searchData = await searchResponse.json();

      const aiText =
        searchData.content?.[0]?.text || "検索結果が見つかりません";
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiText,
        sender: "ai",
        isAnimation: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "エラーが発生しました。もう一度お試しください。",
          sender: "ai",
          isAnimation: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      // サーバーのログアウトAPIを呼び出し (credentials: "include" を使用)
      await fetch("http://127.0.0.1:4000/api/auth/logout", {
        credentials: "include",
      });

      // ローカルストレージとコンポーネントの状態をクリア
      localStorage.removeItem(CHAT_MESSAGES_KEY);
      setMessages([]);

      // ログインページにリダイレクト
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-4xl mx-auto border-x border-gray-200">
      <header className="p-4 bg-violet-800 border-b border-gray-200 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-gray-200">MusiChat</h1>
        <button
          onClick={handleLogout}
          className="mt-2 bg-transparent text-white font-bold py-1 px-3 rounded-full border border-white shadow-lg hover:bg-white hover:text-violet-800 transition-colors text-sm"
        >
          ログアウト
        </button>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow
          ref={chatContainerRef}
          messages={messages}
          isLoading={isLoading}
          setMessages={setMessages}
        />
      </main>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
