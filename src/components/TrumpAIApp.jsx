import React, { useState, useEffect, useRef } from 'react';
import { Send, Twitter } from 'lucide-react';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const TrumpAIApp = () => {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef(null);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesOptions = {
    particles: {
      number: {
        value: 100,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      size: {
        value: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none"
      }
    },
    background: {
      color: "#000000"
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateTrumpResponse = async (userMessage) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are Donald Trump engaging in a debate. Use his characteristic speech patterns, phrases, and debate style. Be assertive, use simple language, repeat key points, and incorporate his famous phrases. Stay in character at all times."
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.9,
          max_tokens: 150
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
      return "Look folks, we're having some technical difficulties. But we'll fix it, we'll fix it better than anyone ever has before!";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsGenerating(true);

    try {
      const trumpResponse = await generateTrumpResponse(userMessage);
      setMessages(prev => [...prev, { 
        type: 'trump', 
        content: trumpResponse 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'trump', 
        content: "Look folks, we're having some technical difficulties. But we'll fix it, we'll fix it better than anyone ever has before!" 
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!showChat) {
    return (
      <div className="relative min-h-screen bg-black">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={particlesOptions}
          className="absolute inset-0"
        />
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white text-center">
          <div className="mb-8">
            <a
              href="https://twitter.com/intent/tweet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Twitter size={20} />
              Follow on Twitter
            </a>
          </div>
          
          <h1 className="text-6xl font-bold mb-4">Trump GPT</h1>
          <p className="text-xl mb-8 max-w-xl">
            Experience the most tremendous AI debate simulator. Nobody does AI better than us, believe me!
          </p>
          
          <button
            onClick={() => setShowChat(true)}
            className="bg-gradient-to-r from-red-600 to-blue-700 text-white px-8 py-3 rounded-full text-xl font-bold hover:opacity-90 transition-colors"
          >
            GET STARTED
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="absolute inset-0"
      />
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-blue-700 text-white py-4 px-6 shadow-lg bg-opacity-90">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Trump GPT</h1>
              <p className="text-sm opacity-90">Powered by tremendous artificial intelligence</p>
            </div>
            <a
              href="https://twitter.com/intent/tweet?text=Just%20had%20a%20tremendous%20debate%20with%20Trump%20AI!%20Try%20it%20yourself%20at%20"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-blue-500 px-4 py-2 rounded-full hover:bg-opacity-90 transition-colors"
            >
              <Twitter size={20} />
              Share on Twitter
            </a>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-black bg-opacity-50 rounded-lg shadow-xl border border-gray-800">
            {/* Messages Container */}
            <div className="h-[60vh] overflow-y-auto p-6">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start mb-4">
                  <div className="bg-red-500 text-white rounded-lg p-3">
                    <div className="flex gap-2">
                      <span className="animate-bounce">•</span>
                      <span className="animate-bounce delay-100">•</span>
                      <span className="animate-bounce delay-200">•</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="border-t border-gray-800 p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-black text-white border border-gray-800 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-red-600 to-blue-700 text-white px-6 py-2 rounded-full hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} />
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-gray-500 text-sm">
            © 2024 Trump GPT • Not affiliated with any political campaign
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrumpAIApp;