import React, {useState, useRef, useEffect, KeyboardEvent} from "react";

interface MessageInputProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    isLoading,
}) => {
    const [text, setText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    const handleSend = () => {
        const trimmedText = text.trim();
        if (trimmedText && !isLoading) {
            onSendMessage(trimmedText);
            setText("");
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 bg-white border-t border-gray-200 flex items-end">
            <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                rows={1}
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-lime-400 transition max-h-40"
                disabled={isLoading}
            />
            <button
                onClick={handleSend}
                disabled={!text.trim() || isLoading}
                className="ml-2 p-2 bg-lime-400 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors flex-shrink-0 flex items-center justify-center h-11 w-11"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 transform rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                </svg>
            </button>
        </div>
    );
};

export default MessageInput;
