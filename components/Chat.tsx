/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Mark this as a Client Component

import { UserButton } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, SendIcon, Trash2 } from "lucide-react"; // Add Trash2 icon

type Message = {
  role: "user" | "ai";
  content: string;
};

type ChatProps = {
  userId: string; // Add userId prop
};

export default function Chat({ userId }: ChatProps) {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]); // Store chat history
  const [currentChatId, setCurrentChatId] = useState<string | null>(null); // Track the current chat session
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch chat history on component mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch("/api/chat/history");
        const data = await response.json();
        setChatHistory(data);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        Math.max(textareaRef.current.scrollHeight, 48),
        150
      )}px`;
    }
  }, [input]);

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, userId }), // Include userId in the request
      });

      const data = await response.json();
      const aiMessage: Message = { role: "ai", content: data.reply };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Failed to fetch response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  // Handle starting a new chat
  const handleNewChat = async () => {
    if (messages.length > 0) {
      // Save the current chat session before starting a new one
      try {
        await fetch("/api/chat/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, userId }),
        });

        // Refetch chat history to update the sidebar
        const historyResponse = await fetch("/api/chat/history");
        const historyData = await historyResponse.json();
        setChatHistory(historyData);
      } catch (error) {
        console.error("Failed to save chat history:", error);
      }
    }

    // Start a new chat session
    setMessages([]);
    setCurrentChatId(null); // Reset the current chat ID
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  // Load a specific chat session from history
  const loadChatSession = (chatId: string) => {
    const chat = chatHistory.find((chat) => chat._id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chat._id);
    }
  };

  // Handle clearing chat history
  const handleClearHistory = async () => {
    try {
      const response = await fetch("/api/chat/history", {
        method: "DELETE",
      });

      if (response.ok) {
        setChatHistory([]); // Clear chat history in the state
        setMessages([]); // Clear the current chat messages
        setCurrentChatId(null); // Reset the current chat ID
      } else {
        console.error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex bg-black text-white overflow-hidden">
      {/* Animated Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70 animate-gradient-x">
        <div className="absolute inset-0 bg-matrix opacity-30"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 w-64 bg-black/50 backdrop-blur-sm border-r border-green-800/30 p-4 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ height: "100vh" }} // Make sidebar full height
      >
        {/* Close Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-2 right-2 p-2 text-green-400 hover:text-green-200"
        >
          <X className="h-6 w-6" />
        </button>

        {/* New Chat Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNewChat}
          className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-8"
        >
          New Chat
        </motion.button>

        {/* Chat History */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-green-400 mb-2">Chat History</h2>
          {chatHistory.map((chat) => (
            <motion.div
              key={chat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => loadChatSession(chat._id)}
              className="p-2 hover:bg-green-800/30 rounded-lg cursor-pointer"
            >
              <p className="text-sm text-green-200 truncate">
                {chat.messages[0]?.content || "New Chat"}
              </p>
              <p className="text-xs text-green-400">
                {new Date(chat.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Clear History Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleClearHistory}
          className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors mt-4 flex items-center justify-center gap-2"
        >
          <Trash2 className="h-4 w-4" /> Clear History
        </motion.button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col w-full">
        {/* Header */}
        <header className="bg-black/50 backdrop-blur-sm border-b border-green-800/30 p-4 flex items-center justify-between w-full">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-green-400 hover:text-green-200"
          >
            {isSidebarOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <h1 className="text-2xl font-bold text-green-400">LUREX AI</h1>
          <div className="w-6">
            <UserButton />
          </div>
        </header>

        {/* Chat Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-y-auto p-4 space-y-4 w-full"
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-green-200"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-green-200 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Input Area */}
        <div className="bg-black/50 backdrop-blur-sm border-t border-green-800/30 p-4 w-full">
          <div className="flex sm:flex-row items-center space-y-2 gap-2 sm:space-y-0 sm:space-x-2 w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              className="flex-1 p-3 bg-gray-800 border border-green-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-green-200 resize-none overflow-hidden"
              placeholder="Type a message..."
              disabled={isLoading}
            />
            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isLoading}
              className="p-3 text-white hover:text-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed self-end"
            >
              {isLoading ? (
                <div className="animate-spin border-2 border-t-2 border-green-400 rounded-full"></div>
              ) : (
                <SendIcon className="h-6 w-6 gap-1" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Global Styles for Matrix Effect */}
      <style jsx global>{`
        @keyframes matrix {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        .bg-matrix {
          background-image: linear-gradient(
              rgba(0, 255, 0, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: matrix 10s linear infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}