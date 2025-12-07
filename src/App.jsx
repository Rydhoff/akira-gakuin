import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Program from "./pages/Program";
import Keberangkatan from "./pages/Keberangkatan";

import { useAuth } from "./contexts/AuthContext";
import StudentDetail from "./pages/StudentDetail";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6">Checking session...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>

      {/* Login tanpa layout */}
      <Route path="/login" element={<Login />} />

      {/* Layout untuk halaman lain */}
      <Route
        path="*"
        element={
          <div className="flex bg-[#F5F7FB] min-h-screen">
            {/* SIDEBAR */}
            <Nav />

            {/* MAIN CONTENT */}
            <main className="flex-1 p-6 ml-0 lg:ml-64 transition-all">
              <div className="bg-white rounded-3xl shadow-sm p-6">
                <Routes>
                  <Route path="/" element={<Protected><Dashboard /></Protected>} />
                  <Route path="/students" element={<Protected><Students /></Protected>} />
                  <Route path="/students/:id" element={<Protected><StudentDetail /></Protected>} />
                  <Route path="/program" element={<Protected><Program /></Protected>} />
                  <Route path="/keberangkatan" element={<Protected><Keberangkatan /></Protected>} />
                </Routes>
              </div>
            </main>
          </div>
        }
      />

    </Routes>
  );
}
