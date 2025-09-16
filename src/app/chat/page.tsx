"use client";

import React, {useState, useRef, useEffect} from "react";
import ChatWindow from "@/components/ChatWindow";
import MessageInput from "@/components/MessageInput";
import {Message} from "@/components/MessageBubble";

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            const {scrollHeight, clientHeight} = chatContainerRef.current;
            chatContainerRef.current.scrollTo({
                top: scrollHeight - clientHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);

    const handleSendMessage = async (text: string) => {
        const userMessage: Message = {id: Date.now(), text, sender: "user"};
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // APIリクエストを送信
            const response = await fetch("http://localhost:3000/api/tool/search-track", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({query: text}),
            });
            console.log("API Response:", response);

            if (!response.ok) {
                throw new Error("APIからの応答がありません。");
            }

            const data = await response.json();

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: data.content[0].text,
                sender: "ai",
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("メッセージの送信に失敗しました:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "エラーが発生しました。もう一度お試しください。",
                sender: "ai",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-4xl mx-auto border-x border-gray-200">
            <header className="p-4 bg-violet-800 border-b border-gray-200 shadow-sm text-center">
                <h1 className="text-xl font-bold text-gray-200">AIチャット</h1>
            </header>
            <main className="flex-1 flex flex-col overflow-hidden">
                <ChatWindow
                    ref={chatContainerRef}
                    messages={messages}
                    isLoading={isLoading}
                />
            </main>
            <MessageInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
            />
        </div>
    );
}
