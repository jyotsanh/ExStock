import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function StockMarketCourse() {
  const [courseData, setCourseData] = useState([]);
  const [openLevel, setOpenLevel] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('📡 Attempting to fetch course data...');
        const res = await fetch('http://192.168.100.53:3000/courses/');
        console.log('✅ Response received:', res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('📦 Parsed data:', data);
        setCourseData(data);
      } catch (err) {
        console.error('❌ Error fetching course data:', err);
        setError('Failed to load course data. Please check your network or API server.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const toggleLevel = (level) => {
    setOpenLevel(openLevel === level ? null : level);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Stock Market Course
      </h1>

      {loading && <p style={{ textAlign: 'center' }}>Loading course data...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {courseData.map((course, index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{course.level} Level</h2>
                  <button
                    onClick={() => toggleLevel(course.level)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {openLevel === course.level ? <ChevronUp /> : <ChevronDown />}
                  </button>
                </div>
                <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>{course.description}</p>
                {openLevel === course.level && (
                  <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '1rem', color: '#374151' }}>
                    {course.topics && course.topics.length > 0 ? (
                      course.topics.map((topic, i) => <li key={i}>{topic}</li>)
                    ) : (
                      <li>No topics listed</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}