import { useState } from 'react'
import { Home, Globe, Users, Settings, List } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const Sidebar = () => {
  const [brandImageOk, setBrandImageOk] = useState(true)

  const navItems = [
    { name: 'Tablero', icon: Home, path: '/' },
    { name: 'Descubrimiento', icon: Globe, path: '/discovery' },
    { name: 'Prospectos', icon: Users, path: '/leads' },
  ]

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

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white w-full rounded-lg hover:bg-white/5 transition-colors">
          <Settings size={18} />
          Configuración
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
