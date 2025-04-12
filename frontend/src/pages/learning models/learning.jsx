import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];

export default function StockMarketCourse() {
  const [courseData, setCourseData] = useState([]);
  const [openLevel, setOpenLevel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const fetchCourses = async (level = null) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = level
        ? `http://192.168.100.53:3000/courses/level/${level}`
        : `http://192.168.100.53:3000/courses/`;

      console.log(`📡 Fetching from ${endpoint}`);
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setCourseData(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError('Failed to load course data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(); // Load all on initial mount
  }, []);

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    fetchCourses(level);
  };

  const toggleLevel = (level) => {
    setOpenLevel(openLevel === level ? null : level);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Stock Market Course
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>Filter by Course Level:</p>
        {COURSE_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => handleLevelClick(level)}
            style={{
              margin: '0 0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: selectedLevel === level ? '2px solid #2563eb' : '1px solid #ccc',
              backgroundColor: selectedLevel === level ? '#2563eb' : 'white',
              color: selectedLevel === level ? 'white' : '#111827',
              cursor: 'pointer',
              transition: '0.3s',
              textTransform: 'capitalize',
            }}
          >
            {level}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedLevel(null);
            fetchCourses(); // All courses
          }}
          style={{
            marginLeft: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: '1px solid #ccc',
            backgroundColor: '#f3f4f6',
            cursor: 'pointer',
          }}
        >
          Show All
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading course data...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {!loading && !error && courseData.length === 0 && (
        <p style={{ textAlign: 'center' }}>No courses found for this level.</p>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {courseData.map((course, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {course.level.charAt(0).toUpperCase() + course.level.slice(1)} Level
                  </h2>
                  <button
                    onClick={() => toggleLevel(course._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {openLevel === course._id ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>{course.description}</p>
                {openLevel === course._id && (
                  <>
                    {course.topics && course.topics.length > 0 && (
                      <ul
                        style={{
                          listStyle: 'disc',
                          paddingLeft: '1.5rem',
                          marginTop: '1rem',
                          color: '#374151',
                        }}
                      >
                        {course.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    )}
                    {course.link && (
                      <p style={{ marginTop: '1rem' }}>
                        🔗 <a href={course.link} target="_blank" rel="noopener noreferrer">{course.platform}</a>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
