import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserPanel from "./components/UserPanel";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import Participants from "./components/Participants";
import PdfUpload from "./components/PdfUpload";
import SelectedList from "./components/SelectedList";
import Home from "./components/Home";

export default function App() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-emerald-400 drop-shadow-lg hover:scale-105 transition-transform"
        >
          SRIMT HACKATHON
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-4 items-center">
          {[
            { path: "/", label: "Home" },
            { path: "/user", label: "QUIZ " },
            { path: "/participants", label: "1ST Participants" },
            { path: "/results", label: "2,3,4 year Participants" },
            { path: "/submit-pdf", label: "Submit PDF" },
            { path: "/admin", label: "Admin", special: true },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className={`px-4 py-2 rounded-2xl shadow-md transition-all transform hover:scale-105 ${
                item.special
                  ? "bg-amber-500 text-black font-semibold hover:bg-amber-400"
                  : "bg-slate-800/70 backdrop-blur-md hover:bg-slate-700/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 shadow-lg"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Sidebar Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-md shadow-2xl z-50 flex flex-col p-6"
          >
            {/* Close button */}
            <button
              className="self-end mb-6 p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Sidebar Links */}
            <div className="flex flex-col gap-4">
              {[
                { path: "/", label: "Home" },
                { path: "/user", label: "QUIZ" },
                { path: "/participants", label: "1st Participants" },
                { path: "/results", label: "2,3,4 year Participants" },
                { path: "/submit-pdf", label: "Submit PDF" },
                { path: "/admin", label: "Admin", special: true },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105 ${
                      item.special
                        ? "bg-amber-500 text-black font-semibold hover:bg-amber-400"
                        : "bg-slate-800/80 backdrop-blur-md hover:bg-slate-700/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/submit-pdf" element={<PdfUpload />} />
          <Route path="/results" element={<SelectedList />} />
          <Route
            path="/admin"
            element={<AdminLogin setIsAdminAuth={setIsAdminAuth} />}
          />
          <Route
            path="/admin/panel"
            element={
              isAdminAuth ? (
                <AdminPanel setIsAdminAuth={setIsAdminAuth} />
              ) : (
                <Navigate to="/admin" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
