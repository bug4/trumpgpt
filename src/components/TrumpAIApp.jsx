import React, { useState, useRef, useEffect } from 'react';
import { Send, Twitter, ClipboardCopy } from 'lucide-react';

const MagaTechApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [contractAddress, setContractAddress] = useState("Loading...");
  const [showMainApp, setShowMainApp] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio('/music.mp3'));

  useEffect(() => {
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    setContractAddress("CNknPx1otgwMA5j25LfJAbdYEN5ZT1yN6FHPckNapump");
  }, []);

  const handleEnter = () => {
    audioRef.current.play();
    setShowMainApp(true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    setShowChat(true);
    setMessages([{
      type: 'ai',
      content: "Welcome to MAGA Tech AI. We're bringing American innovation back, bigger and better than ever before. What would you like to discuss?"
    }]);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      alert("Contract address copied to clipboard!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateAIResponse = async (userMessage) => {
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
              content: "You are MAGA Tech AI, an artificial intelligence focused on American innovation and success. Use confident, optimistic language and focus on American excellence and technological advancement. Stay in character at all times."
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
      return "We're experiencing technical difficulties, but don't worry - American innovation always prevails! Please try again.";
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
      const aiResponse = await generateAIResponse(userMessage);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: aiResponse 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: "We're experiencing technical difficulties, but don't worry - American innovation always prevails! Please try again." 
      }]);
    } finally {
      setIsGenerating(false);
      scrollToBottom();
    }
  };

  if (!showMainApp) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-blue-500 rounded-full opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4}px`,
                  height: `${Math.random() * 4}px`,
                  animation: `float ${Math.random() * 10 + 5}s linear infinite`
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center relative z-10">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
              MAGA Tech AI
            </h1>
            <div className="text-red-500 animate-pulse text-lg">
              Revolutionary American AI Technology
            </div>
          </div>
          
          <button
            onClick={handleEnter}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
            <div className="relative px-10 py-4 bg-black rounded-lg leading-none flex items-center">
              <span className="text-white text-lg uppercase tracking-wider">Enter MAGA Tech</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      <div className="container mx-auto h-screen flex flex-col md:flex-row">
        {/* Left Side - Logo and Info */}
        <div className="md:w-1/2 flex flex-col justify-center items-start p-8">
          <div className="flex flex-col items-start space-y-6 w-full max-w-md">
            <a
              href="https://x.com/magatechai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-white"
            >
              <Twitter size={20} />
              Follow on Twitter
            </a>

            <div className="space-y-3">
              <h1 className="text-7xl font-bold text-white">MAGA Tech AI</h1>
              <p className="text-xl text-blue-400">
                American Innovation, Powered by AI
              </p>
            </div>

            <div className="space-y-4 w-full">
              <button
                onClick={handleGetStarted}
                className="w-full bg-gradient-to-r from-red-600 to-blue-700 text-white px-8 py-4 rounded-full text-xl font-bold hover:opacity-90 transition-colors"
              >
                GET STARTED
              </button>

              <a
                href="https://pump.fun/coin/CNknPx1otgwMA5j25LfJAbdYEN5ZT1yN6FHPckNapump"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-xl font-bold hover:opacity-90 transition-colors"
              >
                Buy $MTEC
              </a>
            </div>

            <div className="w-full space-y-2">
              <p className="text-gray-400">Contract Address:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-black bg-opacity-50 text-gray-300 p-3 rounded-lg overflow-hidden text-ellipsis">
                  {contractAddress}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ClipboardCopy size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Terminal */}
        <div className="md:w-1/2 p-8 flex flex-col h-screen">
          <div className={`flex-1 bg-black bg-opacity-50 rounded-lg border border-gray-800 transition-all duration-500 ${showChat ? 'opacity-100' : 'opacity-50 blur-sm'}`}>
            <div className="flex flex-col h-full">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-250px)]">
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
              <div className="border-t border-gray-800 p-4 mt-auto">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={!showChat}
                    className="flex-1 bg-black text-white border border-gray-800 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500"
                    placeholder={showChat ? "Type your message..." : "Press GET STARTED to begin..."}
                  />
                  <button
                    type="submit"
                    disabled={!showChat || isGenerating}
                    className="bg-gradient-to-r from-red-600 to-blue-700 text-white px-6 py-2 rounded-full hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={16} />
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-gray-400 text-sm">
            © 2025 MAGA Tech AI • Not affiliated with any political campaign
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagaTechApp;