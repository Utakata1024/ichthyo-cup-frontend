import React from "react";
import MessageBubble, {Message} from "./MessageBubble";

type ChatWindowProps = {
    messages: Message[];
    isLoading: boolean;
    setMessages: (msg: Message[]) => void;
    ref: React.RefObject<HTMLDivElement | null>;
};

const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    isLoading,
    setMessages,
    ref,
}) => {
    const handleAnimation = (msg: Message) => {
        setMessages(
            messages.map((m) =>
                m.id === msg.id ? {...m, isAnimation: false} : m,
            ),
        );
    };

    return (
        // チャットウィンドウのコンテナ
        <div
            ref={ref}
            className="flex-1 overflow-y-auto p-4 flex flex-col"
        >
            {/* メッセージのリスト */}
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    handleAnimation={handleAnimation}
                />
            ))}
            {/* AI応答待機中のインジケーター */}
            {isLoading && (
                <div className="bg-gray-200 text-gray-800 self-start px-4 py-2 rounded-lg mb-2 shadow flex items-center">
                    <span className="animate-pulse">...</span>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
