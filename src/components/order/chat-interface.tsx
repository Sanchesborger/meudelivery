"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QUICK_REPLIES } from "@/lib/constants";
import type { ChatMessageWithSender } from "@/types";

interface ChatInterfaceProps {
    open: boolean;
    onClose: () => void;
    recipientName: string;
    recipientAvatar?: string;
    initialMessages?: ChatMessageWithSender[];
}

export function ChatInterface({
    open,
    onClose,
    recipientName,
    recipientAvatar,
    initialMessages = [],
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessageWithSender[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        const newMessage: ChatMessageWithSender = {
            id: Date.now().toString(),
            senderId: "user-1",
            senderName: "Você",
            senderType: "user",
            message: text,
            timestamp: new Date().toISOString(),
            read: true,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            // Simulate response
            const response: ChatMessageWithSender = {
                id: (Date.now() + 1).toString(),
                senderId: "driver-1",
                senderName: recipientName,
                senderType: "driver",
                senderAvatar: recipientAvatar,
                message: "Entendido! Estou a caminho.",
                timestamp: new Date().toISOString(),
                read: false,
            };
            setMessages((prev) => [...prev, response]);
        }, 1500);
    };

    const handleQuickReply = (reply: string) => {
        handleSendMessage(reply);
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Chat com ${recipientName}`}
            size="md"
            showCloseButton={false}
        >
            <div className="flex flex-col h-[70vh]">
                {/* Header with Close */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-semibold">Chat com {recipientName}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-neutral-500">
                                Nenhuma mensagem ainda. Envie uma mensagem para começar!
                            </p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => {
                                const isUser = message.senderType === "user";
                                return (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-2",
                                            isUser ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {!isUser && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {message.senderName.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div
                                            className={cn(
                                                "max-w-[75%] rounded-2xl px-4 py-2",
                                                isUser
                                                    ? "bg-primary-600 text-white rounded-br-sm"
                                                    : "bg-neutral-100 dark:bg-neutral-800 rounded-bl-sm"
                                            )}
                                        >
                                            <p className="text-sm">{message.message}</p>
                                            <span
                                                className={cn(
                                                    "text-xs mt-1 block",
                                                    isUser
                                                        ? "text-primary-100"
                                                        : "text-neutral-500 dark:text-neutral-400"
                                                )}
                                            >
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex gap-2 items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">
                                            {recipientName.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                                            <span
                                                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.2s" }}
                                            />
                                            <span
                                                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0.4s" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length === 0 && (
                    <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
                        <p className="text-xs text-neutral-500 mb-2">Respostas rápidas:</p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_REPLIES.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickReply(reply)}
                                    className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full transition-colors"
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSendMessage(inputValue);
                                }
                            }}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <Button
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim()}
                            className="flex-shrink-0"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
