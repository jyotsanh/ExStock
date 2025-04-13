import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';

const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function StockMarketCourse() {
  const [courseData, setCourseData] = useState([]);
  const [openLevel, setOpenLevel] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unlockedCourses, setUnlockedCourses] = useState([]);

  const fetchCourses = async (level = null) => {
    try {
      setLoading(true);
      setError(null);
      const endpoint = level
        ? `http://192.168.100.81:3000/courses/level/${level}`
        : `http://192.168.100.81:3000/courses/`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCourseData(data);
    } catch (err) {
      setError('Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    fetchCourses(level);
  };

  const toggleCourse = (id) => {
    if (!unlockedCourses.includes(id)) {
      setUnlockedCourses((prev) => [...prev, id]);
    }
    setOpenLevel(openLevel === id ? null : id);
  };

  const isUnlocked = (id) => unlockedCourses.includes(id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-950 text-white px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-tight">📚 Learning Modules</h1>

      {/* Filter Buttons */}
      <div className="text-center mb-10">
        <p className="mb-4 text-gray-300 text-lg">Select Course Level:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {COURSE_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => handleLevelClick(level)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300
                ${
                  selectedLevel === level
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
            >
              {level}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedLevel(null);
              fetchCourses();
            }}
            className="ml-2 px-5 py-2 rounded-full text-sm font-semibold bg-gray-600 hover:bg-gray-500"
          >
            Show All
          </button>
        </div>
      </div>

      {/* Loader / Error / No Courses */}
      {loading && <p className="text-center text-blue-400">⏳ Loading courses...</p>}
      {error && <p className="text-center text-red-400">{error}</p>}
      {!loading && !error && courseData.length === 0 && (
        <p className="text-center text-gray-400">No courses available for this level.</p>
      )}

      {/* Course Cards */}
      <div className="grid gap-6 max-w-5xl mx-auto">
        {courseData.map((course, index) => {
          const unlocked = isUnlocked(course._id);
          return (
            <div
              key={index}
              onClick={() => toggleCourse(course._id)}
              className={`bg-slate-800 rounded-2xl p-6 shadow-lg transition duration-300 cursor-pointer border border-slate-700 hover:shadow-xl ${
                !unlocked ? 'opacity-60 hover:opacity-80' : 'opacity-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {course.title || `${course.level.charAt(0).toUpperCase() + course.level.slice(1)} Level`}
                    {unlocked ? (
                      <Unlock size={18} className="text-green-400" />
                    ) : (
                      <Lock size={18} className="text-gray-400" />
                    )}
                  </h2>
                  <p className="text-gray-400 mt-1">{course.description}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent double toggle
                    toggleCourse(course._id);
                  }}
                  className="text-gray-300 hover:text-white transition"
                >
                  {openLevel === course._id ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {/* Expanded Details */}
              {openLevel === course._id && unlocked && (
                <div className="mt-5 transition-all duration-300">
                  {course.topics?.length > 0 && (
                    <ul className="list-disc list-inside space-y-2 text-gray-300">
                      {course.topics.map((topic, i) => (
                        <li key={i} className="hover:text-white transition">{topic}</li>
                      ))}
                    </ul>
                  )}
                  {course.link && (
                    <p className="mt-4">
                      <span className="text-blue-400">🔗 </span>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-blue-300 hover:text-blue-500 transition"
                      >
                        {course.platform || 'Course Link'}
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
