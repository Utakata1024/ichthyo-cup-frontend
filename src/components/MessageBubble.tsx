import React from "react";
import Linkify from "linkify-react";
import {ReactTyped} from "react-typed";

export type Message = {
    id: number;
    text: string;
    sender: "user" | "ai";
    isAnimation: boolean;
};

type MessageBubbleProps = {
    message: Message;
    handleAnimation: (msg: Message) => void;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    handleAnimation,
}) => {
    const isUser = message.sender === "user";

    // senderによってスタイルを動的に変更
    const bubbleClasses = isUser
        ? "bg-violet-600 text-white self-end" // ユーザーのメッセージは右寄せ
        : "bg-gray-200 text-gray-800 self-start"; // AIのメッセージは左寄せ

    return (
        <div
            className={`max-w-xs md:max-w-lg lg:max-w-lg px-4 py-2 rounded-lg mb-2 shadow ${bubbleClasses}`}
        >
            {message.isAnimation && (
                <ReactTyped
                    strings={[message.text]}
                    typeSpeed={20}
                    showCursor={false}
                    onComplete={() => {
                        handleAnimation(message);
                    }}
                    className="break-all whitespace-pre-wrap"
                ></ReactTyped>
            )}
            {!message.isAnimation && (
                <Linkify
                    options={{
                        className:
                            "text-blue-500 underline break-all hover:opacity-75",
                    }}
                    as="p"
                    className="whitespace-pre-wrap"
                >
                    {message.text}
                </Linkify>
            )}
        </div>
    );
};

export default MessageBubble;
