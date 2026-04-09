import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  Bars3Icon, 
  BellIcon, 
  ArrowRightOnRectangleIcon, 
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  WrenchIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return <Outlet />

  const navigation = {
    ADMIN: [
      { name: 'Dashboard', href: '/admin', icon: HomeIcon },
      { name: 'Clientes', href: '#', icon: UsersIcon },
      { name: 'Técnicos', href: '#', icon: WrenchIcon },
      { name: 'Órdenes', href: '#', icon: ClipboardDocumentListIcon },
    ],
    TECNICO: [
      { name: 'Mis Órdenes', href: '/tecnico', icon: ClipboardDocumentListIcon },
    ],
    CLIENTE: [
      { name: 'Mis Solicitudes', href: '/cliente', icon: ClipboardDocumentListIcon },
    ]
  }

  const currentNav = navigation[user.rol] || []

  return (
    <div className="min-h-screen bg-background text-slate-200 font-outfit overflow-x-hidden">
      {/* Navbar Superior */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/40 backdrop-blur-xl border-b border-white/5 h-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center group cursor-default">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow group-hover:rotate-12 transition-transform duration-300">
                <ServerIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-bold text-white tracking-tight">CLIMA<span className="text-primary-400">TECH</span></h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-[0.2em] uppercase">SENA ADSO</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white leading-none">{user.nombre}</span>
              <span className="text-[11px] text-accent-400 font-bold uppercase mt-1 tracking-wider">{user.rol}</span>
            </div>
            
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 p-[2px] shadow-lg">
              <div className="h-full w-full bg-surface rounded-[10px] flex items-center justify-center overflow-hidden border border-white/10">
                <UsersIcon className="h-6 w-6 text-slate-300" />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all duration-300"
              title="Cerrar Sesión"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-surface border-r border-white/5 z-[70] p-6 md:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-bold text-white">Menú</h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 bg-white/5 rounded-lg">
                   <XMarkIcon className="h-6 w-6 text-slate-400" />
                </button>
              </div>
              <div className="space-y-2">
                {currentNav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                      location.pathname === item.href 
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                        : 'text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="font-semibold">{item.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex pt-20">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-72 fixed left-0 bottom-0 top-20 border-r border-white/5 bg-surface/30 backdrop-blur-md overflow-y-auto px-6 py-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-4">Navegación</p>
            {currentNav.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  location.pathname === item.href 
                    ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-[0_0_20px_rgba(14,165,233,0.1)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-300 ${location.pathname === item.href ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-bold text-sm">{item.name}</span>
                {location.pathname === item.href && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400 shadow-glow"></div>
                )}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="bg-gradient-to-br from-primary-600/20 to-accent-500/10 p-5 rounded-3xl border border-primary-500/20">
               <p className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-2">Ayuda técnica</p>
               <p className="text-[11px] text-slate-400 leading-relaxed">¿Problemas con el sistema? <br/> Contacta a soporte.</p>
               <button className="mt-4 w-full py-2 bg-primary-500 hover:bg-primary-600 text-white text-[11px] font-bold rounded-xl transition-all shadow-glow">
                 Ver Manual
               </button>
             </div>
          </div>
        </aside>

        {/* Contenido Principal */}
        <main className="flex-1 md:ml-72 min-h-[calc(100vh-80px)]">
          <div className="max-w-[1400px] mx-auto relative">
             {/* Decoraciones de fondo flotantes */}
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] pointer-events-none"></div>
             <div className="absolute top-1/2 -right-24 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>
             
             <div className="relative z-10">
                <Outlet />
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Icono Helper para evitar error
const ServerIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
)

export default Layout

