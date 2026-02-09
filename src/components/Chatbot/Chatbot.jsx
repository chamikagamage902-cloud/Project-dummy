import { useState, useRef, useEffect } from 'react'
import { useUser } from '../../context/UserContext'
import { generateResponse, getInitialMessage } from '../../services/chatbot'
import Icon from '../Icon/Icon'
import Button from '../Button/Button'
import './Chatbot.css'

function Chatbot() {
    const { user } = useUser()
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    // Initialize chat with greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const initialMessage = getInitialMessage(user)
            setMessages([{
                id: 1,
                type: 'bot',
                text: initialMessage.text,
                suggestions: initialMessage.suggestions,
                timestamp: new Date()
            }])
        }
    }, [isOpen, user])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    const handleSend = (text = inputValue) => {
        if (!text.trim()) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: text.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate thinking delay
        setTimeout(() => {
            const response = generateResponse(text, user)

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.text,
                suggestions: response.suggestions,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
            setIsTyping(false)
        }, 800 + Math.random() * 700)
    }

    const handleSuggestionClick = (suggestion) => {
        handleSend(suggestion)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatText = (text) => {
        // Convert markdown-like bold to HTML
        return text.split('\n').map((line, i) => {
            const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
        })
    }

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                <span className="toggle-icon">
                    {isOpen ? <Icon name="close" size={24} /> : <Icon name="chat" size={28} />}
                </span>
                {!isOpen && <span className="toggle-pulse" />}
            </button>

            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="header-info">
                        <div className="bot-avatar">
                            <Icon name="leaf" size={24} />
                        </div>
                        <div className="bot-details">
                            <h3 className="bot-name">NutriBot</h3>
                            <span className="bot-status">
                                <span className="status-dot" />
                                Online
                            </span>
                        </div>
                    </div>
                    <button className="close-button" onClick={() => setIsOpen(false)}>
                        <Icon name="close" size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message ${message.type}`}
                        >
                            {message.type === 'bot' && (
                                <div className="message-avatar">
                                    <Icon name="leaf" size={16} />
                                </div>
                            )}
                            <div className="message-content">
                                <div className="message-text">
                                    {formatText(message.text)}
                                </div>
                                {message.suggestions && message.suggestions.length > 0 && (
                                    <div className="message-suggestions">
                                        {message.suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                className="suggestion-chip"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message bot">
                            <div className="message-avatar">
                                <Icon name="leaf" size={16} />
                            </div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chatbot-input">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about nutrition..."
                        disabled={isTyping}
                    />
                    <button
                        className="send-button"
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim() || isTyping}
                    >
                        <Icon name="send" size={20} />
                    </button>
                </div>
            </div>
        </>
    )
}

export default Chatbot
