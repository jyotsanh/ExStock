
const AIAssistant = () => {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">AI Assistant</h1>
        <p>AI Assistant functionality coming soon...</p>
      </div>
    );
  };
  
  export default AIAssistant;
// import { useState } from 'react';
// import { MessageCircle, Send, Zap, X, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

// const AIAssistant = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [messages, setMessages] = useState([
//     { 
//       id: 1, 
//       text: "Hello! I'm your Stock Market AI Assistant. How can I help you today?", 
//       sender: 'ai' 
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);

//   const handleSendMessage = () => {
//     if (inputMessage.trim() === '') return;
    
//     // Add user message
//     const newUserMessage = {
//       id: messages.length + 1,
//       text: inputMessage,
//       sender: 'user'
//     };
    
//     setMessages([...messages, newUserMessage]);
//     setInputMessage('');
    
//     // Simulate AI response
//     setIsTyping(true);
//     setTimeout(() => {
//       const aiResponses = [
//         "I can help you understand market trends and stock terminology.",
//         "Based on current market conditions, technology stocks are showing strong performance.",
//         "Would you like me to explain how to read stock charts?",
//         "I can analyze your portfolio and suggest diversification strategies if you'd like."
//       ];
      
//       const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
//       const newAiMessage = {
//         id: messages.length + 2,
//         text: randomResponse,
//         sender: 'ai'
//       };
      
//       setMessages(prevMessages => [...prevMessages, newAiMessage]);
//       setIsTyping(false);
//     }, 1000);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   const clearChat = () => {
//     setMessages([
//       { 
//         id: 1, 
//         text: "Hello! I'm your Stock Market AI Assistant. How can I help you today?", 
//         sender: 'ai' 
//       }
//     ]);
//   };

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       {/* Collapsed Button */}
//       {!isExpanded && (
//         <button 
//           onClick={toggleExpand}
//           className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
//         >
//           <MessageCircle size={24} />
//         </button>
//       )}
      
//       {/* Expanded Chat Interface */}
//       {isExpanded && (
//         <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-80 md:w-96 overflow-hidden flex flex-col">
//           {/* Header */}
//           <div className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700">
//             <div className="flex items-center space-x-2">
//               <Zap className="text-green-500" size={20} />
//               <h3 className="font-medium text-white">AI Assistant</h3>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button 
//                 onClick={clearChat}
//                 className="text-gray-400 hover:text-white p-1 rounded"
//                 title="Clear chat"
//               >
//                 <RefreshCw size={16} />
//               </button>
//               <button 
//                 onClick={toggleExpand}
//                 className="text-gray-400 hover:text-white p-1 rounded"
//                 title="Minimize"
//               >
//                 <ChevronDown size={16} />
//               </button>
//               <button 
//                 onClick={toggleExpand}
//                 className="text-gray-400 hover:text-white p-1 rounded"
//                 title="Close"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           </div>
          
//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
//             {messages.map((message) => (
//               <div 
//                 key={message.id} 
//                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div 
//                   className={`rounded-lg px-4 py-2 max-w-xs md:max-w-sm ${
//                     message.sender === 'user' 
//                       ? 'bg-green-600 text-white' 
//                       : 'bg-gray-800 text-gray-100'
//                   }`}
//                 >
//                   {message.text}
//                 </div>
//               </div>
//             ))}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-800 rounded-lg px-4 py-2 text-gray-300">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
//                     <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                     <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Input Area */}
//           <div className="border-t border-gray-700 p-3">
//             <div className="relative flex items-center">
//               <input
//                 type="text"
//                 placeholder="Ask about stocks, trading, or analysis..."
//                 className="w-full bg-gray-800 border border-gray-700 rounded-full px-4 py-2 pr-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyDown={handleKeyDown}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="absolute right-2 text-green-500 hover:text-green-400 p-1"
//                 disabled={inputMessage.trim() === ''}
//               >
//                 <Send size={18} />
//               </button>
//             </div>
//           </div>
          
//           {/* Suggestions */}
//           <div className="bg-gray-800 p-3 border-t border-gray-700">
//             <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
//             <div className="flex flex-wrap gap-2">
//               <button 
//                 className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full"
//                 onClick={() => setInputMessage("What stocks are trending today?")}
//               >
//                 Trending stocks
//               </button>
//               <button 
//                 className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full"
//                 onClick={() => setInputMessage("Explain P/E ratio")}
//               >
//                 Explain P/E ratio
//               </button>
//               <button 
//                 className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full"
//                 onClick={() => setInputMessage("How to analyze my portfolio?")}
//               >
//                 Portfolio analysis
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIAssistant;