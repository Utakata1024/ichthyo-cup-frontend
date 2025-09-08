import React, {forwardRef} from "react";
import MessageBubble, {Message} from "./MessageBubble";

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
    ({messages, isLoading}, ref) => {
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
                    />
                ))}
                {/* AI応答待機中のインジケーター */}
                {isLoading && (
                    <div className="bg-gray-200 text-gray-800 self-start px-4 py-2 rounded-lg mb-2 shadow flex items-center">
                        <span className="animate-pulse">
                            AIが応答を生成中...
                        </span>
                    </div>
                )}
            </div>
        );
    },
);

ChatWindow.displayName = "ChatWindow";
export default ChatWindow;
