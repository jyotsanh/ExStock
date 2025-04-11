// NewsSection.jsx
import React from "react";

const dummyNews = [
  { title: "NEPSE gains 10 points", time: "10:30 AM" },
  { title: "Banking sector surges", time: "11:00 AM" },
  { title: "Insurance stocks in focus", time: "11:30 AM" },
];

const NewsSection = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-rose-500">📢 Market News</h2>
      <ul className="space-y-3">
        {dummyNews.map((news, idx) => (
          <li key={idx} className="bg-rose-50 p-3 rounded-lg border-l-4 border-rose-400 shadow-sm">
            <p className="font-medium text-rose-800">{news.title}</p>
            <p className="text-xs text-gray-500">{news.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsSection;
