import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { sendAIChatQuery } from "../../api/aiApi";
import { getCurrentUser } from "../../utils/authhelper";
import "./AIChatbot.css";

function AIChatbot() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Hi! I am ApkaCart AI, your database-aware shopping assistant. Ask me to suggest top brands, products, or budget recommendations!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bodyRef = useRef(null);

    const quickChips = [
        "Suggest top headphone brands",
        "Best earphones under ₹1000",
        "Show white shirts"
    ];

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, loading]);

    // 1. Hide on Signin & Signup pages
    const pathname = location.pathname.toLowerCase();
    if (pathname === "/signin" || pathname === "/signup") {
        return null;
    }

    // 2. Hide on Seller and Admin pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/seller") || pathname.startsWith("/create-store")) {
        return null;
    }

    // 3. Must be signed in (Token exists)
    const token = localStorage.getItem("jwtToken") || localStorage.getItem("token");
    if (!token) {
        return null;
    }

    // 4. Must be a Customer (Hide for Admin & Seller roles)
    const user = getCurrentUser();
    const role = (user?.role || "").toUpperCase();
    if (role === "ADMIN" || role === "SELLER") {
        return null;
    }

    const handleSend = async (queryText) => {
        const textToSend = queryText || input;
        if (!textToSend.trim() || loading) return;

        const userMsg = { sender: "user", text: textToSend };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const data = await sendAIChatQuery(textToSend);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: data.reply || "No response received." }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Unable to reach AI Service. Please check if Spring Boot and Python AI service are running."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-chatbot-container">
            {/* Launcher Button */}
            {!isOpen && (
                <button className="ai-chatbot-launcher" onClick={() => setIsOpen(true)}>
                    <span className="ai-sparkle-icon"></span> ApkaCart AI
                </button>
            )}

            {/* Chatbot Window Modal */}
            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <div className="ai-chat-header-title">
                            <span className="ai-header-sparkle"></span> ApkaCart AI Assistant
                        </div>
                        <button className="ai-chat-close-btn" onClick={() => setIsOpen(false)}>
                            ✕
                        </button>
                    </div>

                    <div className="ai-chat-body" ref={bodyRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}

                        {loading && (
                            <div className="ai-bubble typing">
                                Searching database catalog...
                            </div>
                        )}

                        {!loading && messages.length === 1 && (
                            <div className="ai-quick-suggestions">
                                {quickChips.map((chip, idx) => (
                                    <button
                                        key={idx}
                                        className="ai-chip"
                                        onClick={() => handleSend(chip)}
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="ai-chat-footer">
                        <input
                            type="text"
                            className="ai-chat-input"
                            placeholder="Ask for products, brands, prices..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            className="ai-chat-send-btn"
                            onClick={() => handleSend()}
                            disabled={loading || !input.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AIChatbot;
