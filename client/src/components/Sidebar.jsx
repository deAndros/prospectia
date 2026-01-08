import { useState } from 'react'
import { Home, Globe, Users, Settings, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const Sidebar = () => {
  const [brandImageOk, setBrandImageOk] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const navItems = [
    { name: 'Tablero', icon: Home, path: '/' },
    { name: 'Descubrimiento', icon: Globe, path: '/discovery' },
    { name: 'Prospectos', icon: Users, path: '/leads' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="w-64 border-r border-white/10 h-screen bg-zinc-900/50 backdrop-blur-sm flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="flex items-center">
          {brandImageOk ? (
            <img
              src="/brand-lockup.png"
              alt="ProspectIA"
              className="h-10 w-auto"
              onLoad={() => setBrandImageOk(true)}
              onError={() => setBrandImageOk(false)}
            />
          ) : (
            <span className="leading-tight">
              <span className="block font-['Outfit'] font-black text-2xl tracking-tight text-white">
                ProspectIA
              </span>
            </span>
          )}
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <button
          onClick={() => navigate('/profile')}
          className="px-3 py-2 mb-2 flex items-center gap-3 overflow-hidden hover:bg-white/5 rounded-lg transition-colors w-full text-left group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white/10">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-semibold text-xs">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-xs text-zinc-400 truncate">
              {user?.email}
            </span>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 w-full rounded-lg hover:bg-white/5 transition-colors"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
