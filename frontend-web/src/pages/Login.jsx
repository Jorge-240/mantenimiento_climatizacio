import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { UserIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  // Animaciones Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      
      {/* Elementos decorativos Cyber-tech */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        className="max-w-user w-full max-w-md space-y-8 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <div className="mx-auto h-24 w-24 bg-surface/50 border border-primary-500/30 rounded-2xl flex items-center justify-center shadow-glow backdrop-blur-md mb-6">
            <UserIcon className="h-12 w-12 text-primary-400" />
          </div>
          <h2 className="mt-2 text-4xl font-bold text-white tracking-tight">Iniciar Sesión</h2>
          <p className="mt-3 text-primary-400/80 font-medium tracking-wide uppercase text-sm">Climatización Inteligente ADSO</p>
        </motion.div>

        <motion.form 
          className="mt-8 space-y-6 bg-surface/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-glass relative overflow-hidden" 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {/* Brillo interno superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="bg-red-500/10 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded-r-lg font-medium text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-5">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-primary-500/70 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-12 pr-4 py-3.5 w-full border border-white/10 rounded-xl bg-background/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all shadow-inner"
                  placeholder="admin@sena.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-primary-500/70 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-12 pr-4 py-3.5 w-full border border-white/10 rounded-xl bg-background/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-background bg-gradient-to-r from-primary-400 to-primary-600 hover:from-primary-300 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary-500 transition-all duration-300 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Brillo en hover */}
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative">{loading ? 'Verificando...' : 'Acceder al Sistema'}</span>
            </button>
          </motion.div>
        </motion.form>

        <motion.div variants={itemVariants} className="text-center text-xs font-medium text-slate-500 space-y-1">
          <p>Demo Admin: <span className="text-primary-400">admin@sena.com</span></p>
          <p>Técnico: <span className="text-primary-400">tecnico@test.com</span> | Cliente: <span className="text-accent-500">cliente@test.com</span></p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
