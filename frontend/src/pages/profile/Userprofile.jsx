import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user data from localStorage:", err);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6 w-full text-white text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-14 bg-[#0A1D3D] rounded-2xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold ">{user.username}</h2>
          <p className="text-sm ">{user.email}</p>
        </div>
        <div className="px-3 py-1 rounded-full text-sm font-medium tracking-wide 
          border 
          bg-gray-100 
          text-gray-800
          border-gray-300
        ">
          {user.premium ? "Premium User" : "Standard User"}
        </div>
      </div>

      <div className="mt-6 grid  grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

      
      </div>
    </div>
  );
};

export default UserProfile;
