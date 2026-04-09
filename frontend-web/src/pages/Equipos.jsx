import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  ComputerDesktopIcon,
  MapPinIcon,
  CalendarIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Equipos = () => {
  const [equipos, setEquipos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    clienteId: '',
    serial: '',
    modelo: '',
    tipo: 'AIRE_ACONDICIONADO',
    ubicacion: '',
    fechaInstalacion: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [equipoRes, clienteRes] = await Promise.all([
        api.get('/admin/equipos'),
        api.get('/admin/clientes')
      ])
      setEquipos(equipoRes.data.data || [])
      setClientes(clienteRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/equipos', formData)
      setShowModal(false)
      setFormData({ clienteId: '', serial: '', modelo: '', tipo: 'AIRE_ACONDICIONADO', ubicacion: '', fechaInstalacion: '' })
      fetchData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error al crear equipo')
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-glass">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Gestión de Equipos</h2>
          <p className="text-slate-400 mt-1">Control de inventario de climatización</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-glow hover:scale-105 active:scale-95"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Equipo
        </button>
      </div>

      <div className="bg-surface/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-glass overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por serial o modelo..." 
              className="w-full bg-background/50 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-primary-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Equipo</th>
                <th className="px-6 py-4">Cliente / Empresa</th>
                <th className="px-6 py-4">Serial</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">Cargando inventario...</td></tr>
              ) : equipos.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">No hay equipos registrados</td></tr>
              ) : equipos.map((equipo) => (
                <tr key={equipo.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                        <ComputerDesktopIcon className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">{equipo.modelo}</p>
                        <p className="text-xs text-slate-500">{equipo.tipo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-300">{equipo.cliente?.empresa}</p>
                    <p className="text-xs text-slate-500">{equipo.cliente?.usuario?.nombre}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-primary-400">{equipo.serial}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <MapPinIcon className="h-4 w-4" />
                      {equipo.ubicacion}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      equipo.estado === 'OPERATIVO' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {equipo.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-slate-500 hover:text-white transition-colors">Ver GHoja de Vida</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Equipo */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xl bg-surface border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Registrar Nuevo Equipo</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-xl"><XMarkIcon className="h-6 w-6 text-slate-400"/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Cliente / Empresa</label>
                    <select 
                      required
                      className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-primary-500"
                      value={formData.clienteId}
                      onChange={(e) => setFormData({...formData, clienteId: e.target.value})}
                    >
                      <option value="">Seleccionar Cliente</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.empresa}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Serial del Equipo</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej: SN-2024-XXX"
                      className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-primary-500"
                      value={formData.serial}
                      onChange={(e) => setFormData({...formData, serial: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Modelo / Referencia</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Ej: LG Dual Inverter"
                      className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-primary-500"
                      value={formData.modelo}
                      onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Tipo de Sistema</label>
                    <select 
                      className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-primary-500"
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    >
                      <option value="AIRE_ACONDICIONADO">Aire Acondicionado</option>
                      <option value="CHILLER">Chiller</option>
                      <option value="TORRE_ENFRIAMIENTO">Torre de Enfriamiento</option>
                      <option value="REFRIGERACION_INDUSTRIAL">Refrigeración Industrial</option>
                    </select>
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Ubicación Física</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Edificio C - Planta 3"
                      className="w-full bg-background/50 border border-white/10 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-primary-500"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-glow transition-all">
                  Guardar Equipo en Sistema
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Equipos
