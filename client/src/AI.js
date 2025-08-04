import React, { useState } from 'react';
import './App.css';

function AI() {
    const sampleCategories = [
        { id: 1, name: 'Science' },
        { id: 2, name: 'Technology' },
        { id: 3, name: 'Art' },
    ];

    // const [categories] = useState(sampleCategories);
    // const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCategoryClick = (categ) => {
        // setSelectedCategory(categ);
        setChatHistory([]);
        setError(null);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        // if (!selectedCategory || !searchTerm.trim()) return;

        const userMessage = {
            type: 'user',
            text: searchTerm,
            // timestamp: new Date().toISOString(),
        };

        setChatHistory(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}aichat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: searchTerm,
                    // category: selectedCategory.name
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to get response');
            }
            
            const data = await response.json();
            console.log(data);
            const aiMessage = {
                type: 'ai',
                text: data.message,
                // timestamp: new Date().toISOString(),
            };

            setChatHistory(prev => [...prev, aiMessage]);
            setSearchTerm('');
        } catch (err) {
            setError('Failed to get response. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch(e);
        }
    };

    return (
        <div className="ai-container">
            

            <div className="right-section">
                <div className="ai-chat-container">
                    <div className="ai-chat-history">
                        { chatHistory.length === 0 ? (
                            <div className="ai-chat-placeholder">Ask your first question!</div>
                        ) : (
                            <>
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`ai-message ${msg.type}`}>
                                        <div className="message-content">{msg.text}</div>
                                     </div>
                                ))}
                                {isLoading && (
                                    <div className="ai-message ai typing">
                                        <div className="typing-indicator">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {error && <div className="error-message">{error}</div>}
                    </div>

                    <form className="ai-input-form" onSubmit={handleSearch}>
                        <textarea
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            // placeholder={selectedCategory ? "Type your question..." : "Select a category first"}
                            // disabled={!selectedCategory || isLoading}
                            rows="3"
                        />
                        <button 
                            type="submit"
                            // disabled={!selectedCategory || !searchTerm.trim() || isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AI;