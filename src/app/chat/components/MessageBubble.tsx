import React from "react";

export interface Message {
    id: number;
    text: string;
    sender: "user" | "ai";
}

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({message}) => {
    const isUser = message.sender === "user";

    // senderによってスタイルを動的に変更
    const bubbleClasses = isUser
        ? "bg-purple-600 text-white self-end" // ユーザーのメッセージは右寄せ
        : "bg-gray-200 text-gray-800 self-start"; // AIのメッセージは左寄せ

    return (
        <div
            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg mb-2 shadow ${bubbleClasses}`}
        >
            {/* 改行を反映させるために whitespace-pre-wrap を使用 */}
            <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
    );
};

export default MessageBubble;
