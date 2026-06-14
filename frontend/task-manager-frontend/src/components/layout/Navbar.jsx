import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CheckSquare, LogOut, LayoutDashboard, User } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLink = (to, label, Icon) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${location.pathname === to
          ? 'bg-primary-50 text-primary-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
    >
      <Icon size={16} />
      {label}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-primary-700">
            <CheckSquare size={22} />
            <span className="text-lg">TaskFlow</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
          </div>

          {/* User + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                <User size={14} />
              </div>
              <span className="font-medium">{user?.name || user?.email?.split('@')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-ghost text-slate-500 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
