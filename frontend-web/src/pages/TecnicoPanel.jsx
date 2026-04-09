import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, ClipboardDocumentListIcon, PlusCircleIcon, WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline'

const TecnicoPanel = () => {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('EN_PROGRESO')
  const [selectedOrden, setSelectedOrden] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [mantenimiento, setMantenimiento] = useState({
    tipo: 'PREVENTIVO',
    descripcion: '',
    horasTrabajadas: ''
  })

  useEffect(() => {
    fetchOrdenes()
  }, [filter])

  const fetchOrdenes = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/tecnico/ordenes`, { params: { estado: filter } })
      setOrdenes(res.data?.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCrearMantenimiento = async (e) => {
    e.preventDefault()
    if (!selectedOrden || !mantenimiento.descripcion) return

    try {
      await api.post('/tecnico/mantenimientos', {
        ordenId: selectedOrden.id,
        tipo: mantenimiento.tipo,
        descripcion: mantenimiento.descripcion,
        horasTrabajadas: parseFloat(mantenimiento.horasTrabajadas),
        evidenciaUrl: 'https://via.placeholder.com/400'
      })
      setMantenimiento({ tipo: 'PREVENTIVO', descripcion: '', horasTrabajadas: '' })
      setSelectedOrden(null)
      setShowForm(false)
      fetchOrdenes()
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || 'Error desconocido'))
    }
  }

  const handleCompletarOrden = async (ordenId) => {
    try {
      await api.put(`/tecnico/ordenes/${ordenId}/completar`, {})
      fetchOrdenes()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="p-4 md:p-8 space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-glass gap-4">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <WrenchScrewdriverIcon className="h-8 w-8 text-accent-500" />
            Panel Técnico
          </h1>
          <p className="text-slate-400 mt-1">Central de operaciones y registro de mantenimientos</p>
        </div>
      </div>

      <div className="bg-surface/30 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex gap-3 overflow-x-auto">
        {['EN_PROGRESO', 'PENDIENTE', 'COMPLETADA'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow border border-primary-400/50'
                : 'bg-background text-slate-400 border border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            {status === 'EN_PROGRESO' && '🔄 En Progreso'}
            {status === 'PENDIENTE' && '⏳ Pendientes'}
            {status === 'COMPLETADA' && '✅ Completadas'}
          </button>
        ))}
      </div>

      {ordenes.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-surface/30 border border-white/5 backdrop-blur-xl rounded-3xl p-16 text-center">
          <ClipboardDocumentListIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-xl font-medium mb-2">No hay órdenes en este estado</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ordenes.map(orden => (
            <motion.div key={orden.id} variants={itemVariants} className="bg-surface/50 border border-white/10 rounded-3xl p-6 shadow-glass hover:border-primary-500/30 transition-all flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary-500 to-accent-500"></div>
              
              <div className="flex justify-between items-start mb-6 pl-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1"><span className="text-primary-500">#</span>{orden.id}</h3>
                  <p className="text-sm font-medium text-slate-300 bg-background/50 px-3 py-1 rounded-full border border-white/5 inline-block">
                    {orden.cliente?.usuario?.nombre || 'Cliente Anónimo'}
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  orden.estado === 'EN_PROGRESO' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' :
                  orden.estado === 'COMPLETADA' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {orden.estado}
                </span>
              </div>

              <div className="bg-background/40 p-4 rounded-2xl border border-white/5 mb-6 pl-6 space-y-2">
                <p className="text-sm text-slate-300"><strong className="text-white font-medium">Equipo:</strong> {orden.equipo?.modelo} <span className="text-slate-500">({orden.equipo?.serial})</span></p>
                <p className="text-sm text-slate-300"><strong className="text-white font-medium">Ubicación:</strong> {orden.equipo?.ubicacion}</p>
                <div className="pt-2 mt-2 border-t border-white/5">
                  <p className="text-sm text-slate-400 font-medium mb-1">Descripción del problema:</p>
                  <p className="text-slate-200">{orden.descripcion}</p>
                </div>
              </div>

              <div className="flex gap-3 pl-4 mt-auto">
                <button
                  onClick={() => { setSelectedOrden(orden); setShowForm(true); }}
                  className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-surface border border-primary-500/30 hover:border-primary-500 hover:bg-primary-500/10 text-primary-400 rounded-xl font-bold transition-all"
                >
                  <PlusCircleIcon className="h-5 w-5" /> Registrar Mant.
                </button>
                {(orden.mantenimientos?.length > 0 && orden.estado !== 'COMPLETADA') && (
                  <button
                    onClick={() => handleCompletarOrden(orden.id)}
                    className="flex-1 flex justify-center items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold transition-all"
                  >
                    <CheckCircleIcon className="h-5 w-5" /> Completar
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && selectedOrden && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface border border-white/10 rounded-3xl shadow-glow max-w-md w-full p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <WrenchScrewdriverIcon className="h-6 w-6 text-primary-400" />
                    Nuevo Reporte
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Orden #{selectedOrden.id} - {selectedOrden.equipo?.modelo}</p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCrearMantenimiento} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Clasificación</label>
                  <select
                    value={mantenimiento.tipo}
                    onChange={(e) => setMantenimiento({...mantenimiento, tipo: e.target.value})}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-background text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                  >
                    <option value="PREVENTIVO">Mantenimiento Preventivo</option>
                    <option value="CORRECTIVO">Mantenimiento Correctivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Resumen de labores</label>
                  <textarea
                    value={mantenimiento.descripcion}
                    onChange={(e) => setMantenimiento({...mantenimiento, descripcion: e.target.value})}
                    placeholder="Detalla los repuestos usados y el trabajo final..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-background text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    rows="4" required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Horas Invertidas</label>
                  <input
                    type="number" step="0.5" min="0"
                    value={mantenimiento.horasTrabajadas}
                    onChange={(e) => setMantenimiento({...mantenimiento, horasTrabajadas: e.target.value})}
                    placeholder="Ej. 1.5"
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-background text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl font-bold shadow-glow transition-all">
                    Registrar Actividad
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default TecnicoPanel