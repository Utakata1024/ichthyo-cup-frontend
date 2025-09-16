import React from "react";
import Linkify from "linkify-react";

export type Message = {
    id: number;
    text: string;
    sender: "user" | "ai";
};

type MessageBubbleProps = {
    message: Message;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({message}) => {
    const isUser = message.sender === "user";

    // senderによってスタイルを動的に変更
    const bubbleClasses = isUser
        ? "bg-violet-600 text-white self-end" // ユーザーのメッセージは右寄せ
        : "bg-gray-200 text-gray-800 self-start"; // AIのメッセージは左寄せ

    const options = {
        className: "text-blue-500 underline hover:opacity-75",
    };

    return (
        <div
            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg mb-2 shadow ${bubbleClasses}`}
        >
            {/* 改行を反映させるために whitespace-pre-wrap を使用 */}
            <Linkify
                options={{ className: "text-blue-500 underline hover:opacity-75" }}
                as="p"
                className="whitespace-pre-wrap"
            >
                {message.text}
            </Linkify>
        </div>
    );
};

export default MessageBubble;
