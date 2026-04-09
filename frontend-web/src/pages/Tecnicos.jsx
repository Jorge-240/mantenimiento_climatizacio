import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  UserPlusIcon, 
  AcademicCapIcon,
  PhoneIcon,
  IdentificationIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Tecnicos = () => {
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    especialidad: '',
    telefono: '',
    certificado: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/tecnicos')
      setTecnicos(res.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/tecnicos', formData)
      setShowModal(false)
      setFormData({ nombre: '', email: '', password: '', especialidad: '', telefono: '', certificado: '' })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear técnico')
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-glass">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Gestión de Técnicos</h2>
          <p className="text-slate-400 mt-1">Personal capacitado de mantenimiento</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105"
        >
          <UserPlusIcon className="h-5 w-5" />
          Registrar Técnico
        </button>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-glass overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o especialidad..." 
              className="w-full bg-background/50 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Técnico</th>
                <th className="px-6 py-4">Especialidad</th>
                <th className="px-6 py-4">Certificación</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Órdenes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Cargando personal...</td></tr>
              ) : tecnicos.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">No hay técnicos registrados</td></tr>
              ) : tecnicos.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-accent-500/20 rounded-xl flex items-center justify-center border border-accent-500/30">
                        <IdentificationIcon className="h-5 w-5 text-accent-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{t.usuario?.nombre}</p>
                        <p className="text-xs text-slate-500">{t.usuario?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <AcademicCapIcon className="h-4 w-4 text-emerald-500" />
                      {t.especialidad}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{t.certificado || 'N/A'}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2 text-sm text-slate-400 italic">
                      <PhoneIcon className="h-4 w-4" />
                      {t.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                       Disponible
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className="px-3 py-1 bg-white/5 rounded-lg text-white font-bold">{t._count?.ordenes || 0}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Técnico */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-surface border border-white/10 rounded-3xl shadow-2xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-accent-500/10 rounded-t-3xl text-accent-400">
                <h3 className="text-xl font-bold">Vincular Nuevo Especialista</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-xl"><XMarkIcon className="h-6 w-6"/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre Completo</label>
                    <input required type="text" placeholder="Ej: Carlos Alberto" className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Correo (Acceso)</label>
                    <input required type="email" placeholder="tecnico@sena.edu.co" className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contraseña</label>
                    <input required type="password" placeholder="••••••••" className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Especialidad</label>
                    <input type="text" placeholder="Ej: Refrigeración VRF" className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200" value={formData.especialidad} onChange={(e) => setFormData({...formData, especialidad: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Teléfono</label>
                    <input type="text" placeholder="+57 321..." className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all uppercase tracking-widest text-sm">
                  Finalizar Registro de Técnico
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tecnicos
