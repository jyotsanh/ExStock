
import React, { useState } from 'react';
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, BookmarkIcon } from 'lucide-react';

const LearningModules = () => {
  const [expandedCategory, setExpandedCategory] = useState('beginner');
  const [selectedLesson, setSelectedLesson] = useState({
    id: 'b1',
    title: 'Introduction to Stock Markets',
    category: 'beginner',
    progress: 60,
  });

  // Mock data for demonstration
  const modules = {
    beginner: [
      { id: 'b1', title: 'Introduction to Stock Markets', completed: false, progress: 60 },
      { id: 'b2', title: 'Understanding Market Orders', completed: true, progress: 100 },
      { id: 'b3', title: 'Basic Chart Analysis', completed: false, progress: 0 },
      { id: 'b4', title: 'Market Indices Explained', completed: false, progress: 0 },
    ],
    intermediate: [
      { id: 'i1', title: 'Technical Analysis Basics', completed: false, progress: 0 },
      { id: 'i2', title: 'Fundamental Analysis', completed: false, progress: 0 },
      { id: 'i3', title: 'Risk Management Strategies', completed: false, progress: 0 },
    ],
    advanced: [
      { id: 'a1', title: 'Options Trading Fundamentals', completed: false, progress: 0 },
      { id: 'a2', title: 'Advanced Chart Patterns', completed: false, progress: 0 },
      { id: 'a3', title: 'Algorithmic Trading Concepts', completed: false, progress: 0 },
    ],
  };

  const mockLessonContent = {
    b1: {
      sections: [
        {
          title: 'What Are Stock Markets?',
          content: 'Stock markets are organized marketplaces where shares of publicly held companies are issued and traded. They provide companies with access to capital and investors with a slice of ownership in the company and the potential to realize gains based on the future performance of the company.',
        },
        {
          title: 'Key Market Participants',
          content: 'The main participants in stock markets include retail investors (individuals), institutional investors (pension funds, mutual funds, etc.), market makers, brokers, and regulators.',
        },
        {
          title: 'Stock Market Indices',
          content: 'Stock market indices like the S&P 500, Dow Jones, and NASDAQ are statistical measures that show the composite value of selected stocks, representing a particular market or sector.',
        },
      ],
      video: 'intro_to_markets.mp4',
      quiz: [
        {
          question: 'What is the primary purpose of stock markets?',
          options: [
            'To provide companies with access to capital',
            'To provide entertainment for traders',
            'To regulate company operations',
            'To set product prices',
          ],
          correctAnswer: 0,
        },
        {
          question: 'Which of the following is NOT a major stock market index?',
          options: [
            'S&P 500',
            'Dow Jones Industrial Average',
            'NASDAQ',
            'Bitcoin 100',
          ],
          correctAnswer: 3,
        },
      ],
    },
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const selectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const renderLessonContent = () => {
    const content = mockLessonContent[selectedLesson.id];
    if (!content) return <div className="text-center py-12 text-gray-400">Select a lesson to view content</div>;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="bg-[#0A1D3D] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#00FF88] to-[#00BFFF] h-full"
            style={{ width: `${selectedLesson.progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-right text-gray-400">Progress: {selectedLesson.progress}%</div>
        
        {/* Content Sections */}
        <div className="space-y-8">
          {content.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="text-xl font-medium text-[#00FF88]">{section.title}</h3>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
        
        {/* Video */}
        {content.video && (
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-3">Video Tutorial</h3>
            <div className="bg-[#0A1D3D] h-48 rounded-lg flex items-center justify-center">
              <div className="text-gray-400">Video player: {content.video}</div>
            </div>
          </div>
        )}
        
        {/* Quiz */}
        {content.quiz && (
          <div className="mt-8">
            <h3 className="text-xl font-medium text-[#00FF88] mb-4">Knowledge Check</h3>
            <div className="space-y-6">
              {content.quiz.map((question, qIdx) => (
                <div key={qIdx} className="bg-[#0A1D3D] p-4 rounded-lg">
                  <h4 className="font-medium mb-3">{question.question}</h4>
                  <div className="space-y-2">
                    {question.options.map((option, oIdx) => (
                      <div 
                        key={oIdx}
                        className={`p-3 rounded cursor-pointer ${
                          oIdx === question.correctAnswer 
                            ? 'bg-green-900 bg-opacity-30 border border-green-500' 
                            : 'bg-[#132447] hover:bg-[#1D3055]'
                        }`}
                      >
                        {option}
                        {oIdx === question.correctAnswer && (
                          <CheckCircleIcon className="inline ml-2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Continue Button */}
        <div className="mt-12 text-center">
          <button className="bg-gradient-to-r from-[#00FF88] to-[#00BFFF] text-black font-medium py-3 px-6 rounded-full hover:opacity-90 transition-opacity">
            Continue Learning
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Learning Modules</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Categories */}
          {['beginner', 'intermediate', 'advanced'].map((category) => (
            <div key={category} className="bg-[#0A1D3D] rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <h2 className="text-lg font-medium capitalize">{category}</h2>
                {expandedCategory === category ? (
                  <ChevronUpIcon className="h-5 w-5" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" />
                )}
              </div>
              
              {expandedCategory === category && (
                <div className="border-t border-[#132447]">
                  {modules[category].map((lesson) => (
                    <div 
                      key={lesson.id}
                      className={`p-4 flex items-center cursor-pointer ${
                        selectedLesson.id === lesson.id ? 'bg-[#132447]' : 'hover:bg-[#132447]'
                      }`}
                      onClick={() => selectLesson({ ...lesson, category })}
                    >
                      {lesson.completed ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <div className={`h-5 w-5 rounded-full mr-3 flex-shrink-0 ${
                          lesson.progress > 0 ? 'bg-blue-500' : 'border border-gray-500'
                        }`}></div>
                      )}
                      <span className="flex-grow">{lesson.title}</span>
                      <BookmarkIcon className="h-4 w-4 text-gray-400 hover:text-[#00FF88] transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="lg:col-span-2 bg-[#071428] rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">{selectedLesson.title}</h2>
          {renderLessonContent()}
        </div>
      </div>
    </div>
  );
};

export default LearningModules;