import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [teacher, setTeacher] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("dnc_token");
    const storedTeacher = localStorage.getItem("dnc_teacher");
    if (storedToken && storedTeacher) {
      setToken(storedToken);
      setTeacher(JSON.parse(storedTeacher));
    }
  }, []);

  const login = (teacherData, tokenData) => {
    setTeacher(teacherData);
    setToken(tokenData);
    localStorage.setItem("dnc_token", tokenData);
    localStorage.setItem("dnc_teacher", JSON.stringify(teacherData));
  };

  const logout = () => {
    setTeacher(null);
    setToken(null);
    localStorage.removeItem("dnc_token");
    localStorage.removeItem("dnc_teacher");
  };

  return (
    <AuthContext.Provider value={{ teacher, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
