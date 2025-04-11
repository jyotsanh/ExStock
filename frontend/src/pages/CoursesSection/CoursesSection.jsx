// CoursesSection.jsx
import React from "react";

const dummyCourses = [
  { title: "📘 Intro to Stock Market", progress: "40%", color: "bg-cyan-100 text-cyan-800" },
  { title: "📊 Technical Analysis", progress: "25%", color: "bg-yellow-100 text-yellow-800" },
  { title: "🧠 Trading Psychology", progress: "60%", color: "bg-emerald-100 text-emerald-800" },
];

const CoursesSection = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-emerald-500">🎓 Courses</h2>
      <ul className="space-y-3">
        {dummyCourses.map((course, idx) => (
          <li key={idx} className={`p-4 rounded-lg shadow-md border-l-4 border-emerald-500 ${course.color}`}>
            <p className="font-semibold">{course.title}</p>
            <p className="text-sm">Progress: {course.progress}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesSection;
