import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { FileTextIcon, Menu, X } from 'lucide-react';
import { useState } from "react";

const Navbar = ()=>{
    const {isAuthenticated, user, logout} = useAuth();
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = ()=>{
        logout()
        navigate('/')
        setMenuOpen(false);
    }

    return (
        <nav className="border-b border-white/10 bg-black/40 backdrop-blur-md relative">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex items-center justify-between h-16">

      <Link
        to="/"
        className="flex items-center gap-2 text-white font-semibold text-lg"
      >
        <FileTextIcon className="w-6 h-6 text-indigo-400" />
        Visual Resume Builder
      </Link>

      <div className="hidden md:flex items-center gap-6 text-sm">

        <Link
          to="/"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Home
        </Link>

        {isAuthenticated && (
          <>
            <Link
              to="/builder"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Builder
            </Link>

            <Link
              to="/ats"
              className="text-gray-300 hover:text-white transition-colors"
            >
              ATS
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          </>
        )}

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Hi, {user?.name}</span>

            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition"
      >
        {menuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

    </div>
  </div>

  {menuOpen && (
    <div className="md:hidden absolute top-16 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/10">
      <div className="flex flex-col px-6 py-6 space-y-4 text-sm">

        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-gray-300 hover:text-white"
        >
          Home
        </Link>

        {isAuthenticated && (
          <>
            <Link
              to="/builder"
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              Builder
            </Link>

            <Link
              to="/ats"
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              ATS Checker
            </Link>

            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              Dashboard
            </Link>
          </>
        )}

        {isAuthenticated ? (
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <span className="text-gray-400">Hi, {user?.name}</span>

            <button
              onClick={handleLogout}
              className="text-left text-indigo-400 font-semibold hover:text-indigo-300"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="rounded-md bg-indigo-500 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400"
            >
              Get Started
            </Link>
          </div>
        )}

      </div>
    </div>
  )}
</nav>
    )
}

export default Navbar