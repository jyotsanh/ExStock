import { useState, useEffect, useRef } from 'react';
import { Send, Zap, RefreshCw, Search, X, Info, TrendingUp, PieChart, DollarSign, BookOpen } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your Stock Market AI Assistant. How can I help you today?", 
      sender: 'ai' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Send GET request to FastAPI endpoint
    const senderId = "user123"; // You can replace this with actual user ID if available
    const apiUrl = `http://192.168.100.88:8020?query=${encodeURIComponent(inputMessage)}&senderId=${encodeURIComponent(senderId)}`;
    
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Create AI message using the response from the API
        const newAiMessage = {
          id: messages.length + 2,
          text: data.result,
          sender: 'ai'
        };
        
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
      })
      .catch(error => {
        console.error('Error fetching response:', error);
        
        // Create error message if the API request fails
        const errorMessage = {
          id: messages.length + 2,
          text: "Sorry, I couldn't connect to the assistant service. Please try again later.",
          sender: 'ai'
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 1, 
        text: "Hello! I'm your Stock Market AI Assistant. How can I help you today?", 
        sender: 'ai' 
      }
    ]);
  };

  const setSuggestedQuestion = (question) => {
    setInputMessage(question);
  };

  // Educational resources for the Learn tab
  const educationalResources = [
    {
      title: "Understanding Stock Fundamentals",
      description: "Learn how to analyze a company's financial health through balance sheets, income statements, and cash flow statements.",
      icon: <Info size={20} className="text-green-500" />
    },
    {
      title: "Technical Analysis Basics",
      description: "Discover how to read charts, identify patterns, and use indicators to make trading decisions.",
      icon: <TrendingUp size={20} className="text-green-500" />
    },
    {
      title: "Portfolio Construction Strategies",
      description: "Explore different approaches to building a resilient and balanced investment portfolio.",
      icon: <PieChart size={20} className="text-green-500" />
    },
    {
      title: "Investment Vehicles Compared",
      description: "Compare stocks, ETFs, mutual funds, bonds, and other investment options.",
      icon: <DollarSign size={20} className="text-green-500" />
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* AI Assistant Header */}
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Zap className="text-green-500" size={24} />
          <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-md ${activeTab === 'chat' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('learn')}
            className={`px-4 py-2 rounded-md ${activeTab === 'learn' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
          >
            <div className="flex items-center space-x-2">
              <BookOpen size={18} />
              <span>Learn</span>
            </div>
          </button>
          <button 
            onClick={clearChat}
            className="text-gray-400 hover:text-white rounded-md p-2"
            title="Clear conversation"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
      
      {activeTab === 'chat' ? (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-lg px-6 py-4 max-w-xl ${
                      message.sender === 'user' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg px-6 py-4 text-gray-300">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-700 bg-gray-800 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask about stocks, trading, or analysis..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 pr-14 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 text-green-500 hover:text-green-400 p-2 rounded-full hover:bg-gray-700"
                  disabled={inputMessage.trim() === ''}
                >
                  <Send size={20} />
                </button>
              </div>
              
              {/* Suggested Questions */}
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Popular questions:</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setSuggestedQuestion("What stocks are trending today?")}
                  >
                    Trending stocks
                  </button>
                  <button 
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setSuggestedQuestion("Explain P/E ratio in simple terms")}
                  >
                    Explain P/E ratio
                  </button>
                  <button 
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setSuggestedQuestion("How to analyze my portfolio?")}
                  >
                    Portfolio analysis
                  </button>
                  <button 
                    className="text-sm bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => setSuggestedQuestion("How do I read stock charts?")}
                  >
                    Reading charts
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Learn Tab Content */
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Educational Resources</h3>
              <p className="text-gray-300 mb-6">
                Enhance your stock market knowledge with these curated learning resources.
              </p>
              
              {/* Search Bar */}
              <div className="relative mb-8">
                <input
                  type="text"
                  placeholder="Search for resources..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
              </div>
              
              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {educationalResources.map((resource, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-all cursor-pointer">
                    <div className="flex items-center mb-4">
                      {resource.icon}
                      <h4 className="text-lg font-medium text-white ml-3">{resource.title}</h4>
                    </div>
                    <p className="text-gray-300 mb-4">{resource.description}</p>
                    <button className="text-green-500 hover:text-green-400 text-sm font-medium flex items-center">
                      Learn more
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Reference Guide */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Quick Reference Guide</h3>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-md font-medium text-white mb-2">Common Stock Market Terms</h5>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li><span className="text-green-500 font-medium">Bull Market</span> - A market characterized by rising prices and optimism</li>
                      <li><span className="text-green-500 font-medium">Bear Market</span> - A market characterized by falling prices and pessimism</li>
                      <li><span className="text-green-500 font-medium">Dividend</span> - A portion of a company's earnings paid to shareholders</li>
                      <li><span className="text-green-500 font-medium">Market Cap</span> - The total value of a company's outstanding shares</li>
                      <li><span className="text-green-500 font-medium">Volatility</span> - The rate at which the price of a security increases or decreases</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-md font-medium text-white mb-2">Key Investment Strategies</h5>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      <li><span className="text-green-500 font-medium">Value Investing</span> - Seeking undervalued stocks with strong fundamentals</li>
                      <li><span className="text-green-500 font-medium">Growth Investing</span> - Focusing on stocks with above-average growth potential</li>
                      <li><span className="text-green-500 font-medium">Dollar-Cost Averaging</span> - Investing fixed amounts at regular intervals</li>
                      <li><span className="text-green-500 font-medium">Income Investing</span> - Prioritizing investments that generate regular income</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
