"use client";

import React, {useState, useRef, useEffect} from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import {Message} from "./components/MessageBubble";

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

    const handleSendMessage = (text: string) => {
        const userMessage: Message = {id: Date.now(), text, sender: "user"};
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        setTimeout(() => {
            const aiMessage: Message = {
                id: Date.now() + 1,
                text: `「${text}」についてのAIの返信です。`,
                sender: "ai",
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-4xl mx-auto border-x border-gray-200">
            <header className="p-4 bg-white border-b border-gray-200 shadow-sm text-center">
                <h1 className="text-xl font-bold text-gray-800">AIチャット</h1>
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
