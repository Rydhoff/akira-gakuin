import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, LogOut, Home, Users, BookOpen, Plane } from "lucide-react";
import logo from "/Logo LPK Akira Gakuin.png";

export default function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // 🚀 Penting: Jangan render Nav jika user belum login
  if (!user) return null;

  const menu = [
    { to: "/", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/students", label: "Students", icon: <Users size={18} /> },
    { to: "/program", label: "Program", icon: <BookOpen size={18} /> },
    { to: "/keberangkatan", label: "Keberangkatan", icon: <Plane size={18} /> },
  ];

  return (
    <>
      {/* TOP BAR MOBILE */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3
        bg-white w-full border-b border-(--akira-border)
        fixed top-0 left-0 z-40 shadow-sm"
        >
        <button onClick={() => setOpen(true)}><Menu size={26} /></button>
        <span className="font-semibold text-lg text-(--akira-red)">
            Akira Gakuin
        </span>
        </div>

        {/* SIDEBAR */}
        <aside
        className={`
            fixed top-0 left-0 h-screen w-64 bg-white border-r border-(--akira-border)
            rounded-r-[30px] px-6 py-8 flex flex-col transition-all duration-300
            overflow-y-auto shadow-lg

            ${open 
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none"
            }

            lg:translate-x-0 lg:opacity-100 lg:pointer-events-auto
        `}
        >

        {/* LOGO */}
        <div className="mb-10 text-center">
            <img src={logo} alt="logo" className="w-28 m-auto" />
            <div className="font-bold text-xl text-(--akira-gray) tracking-wide mt-1">
            Akira Gakuin
            </div>
            <div className="text-xs text-gray-500 mt-1">Management System</div>
        </div>

        {/* MENU */}
        <nav className="flex-1 space-y-2">
            {menu.map((m) => {
            const path = location.pathname || "";
            const active = m.to === "/" ? path === "/" : path.startsWith(m.to + (m.to.endsWith("/") ? "" : ""));
            return (
                <Link
                key={m.to}
                to={m.to}
                onClick={() => setOpen(false)}
                className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition

                    ${
                    active
                        ? "bg-(--akira-red) text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                `}
                >
                {m.icon}
                {m.label}
                </Link>
            );
            })}
        </nav>

        {/* LOGOUT */}
        <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
            text-(--akira-red) hover:bg-red-50 mt-6 transition"
        >
            <LogOut size={20} /> Logout
        </button>

        </aside>

    </>
  );
}
