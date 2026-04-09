import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, EyeIcon, XMarkIcon, CheckCircleIcon, DocumentIcon } from '@heroicons/react/24/outline'

const ClienteArea = () => {
  const [ordenes, setOrdenes] = useState([])
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedOrden, setSelectedOrden] = useState(null)
  const [newOrden, setNewOrden] = useState({
    equipoId: '',
    descripcion: '',
    prioridad: 'MEDIA'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [ordenesRes, equiposRes] = await Promise.all([
        api.get('/cliente/ordenes').catch(()=>({data:{data:[]}})),
        api.get('/cliente/equipos').catch(()=>({data:{data:[]}}))
      ])
      setOrdenes(ordenesRes.data?.data || [])
      setEquipos(equiposRes.data?.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSolicitarServicio = async (e) => {
    e.preventDefault()
    if (!newOrden.equipoId || !newOrden.descripcion) {
      alert('❌ Por favor completa todos los campos')
      return
    }

    try {
      await api.post('/cliente/ordenes', {
        equipoId: parseInt(newOrden.equipoId),
        descripcion: newOrden.descripcion,
        prioridad: newOrden.prioridad
      })
      setNewOrden({ equipoId: '', descripcion: '', prioridad: 'MEDIA' })
      setShowForm(false)
      fetchData()
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || 'Desconocido'))
    }
  }

  const handleCancelarOrden = async (ordenId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta orden?')) return
    try {
      await api.put(`/cliente/ordenes/${ordenId}/cancelar`, {
        motivo: 'Cancelada por cliente'
      })
      fetchData()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  const handleAprobarCotizacion = async (cotizacionId) => {
    try {
      await api.put(`/cliente/cotizaciones/${cotizacionId}/aprobar`)
      fetchData()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  const getStatusColor = (estado) => {
    switch(estado) {
      case 'COMPLETADA': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
      case 'EN_PROGRESO': return 'bg-primary-500/20 text-primary-400 border-primary-500/50'
      case 'ASIGNADA': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/50'
    }
  }

  const getPrioridadColor = (prioridad) => {
    switch(prioridad) {
      case 'URGENTE': return 'text-rose-400'
      case 'ALTA': return 'text-orange-400'
      case 'MEDIA': return 'text-primary-400'
      default: return 'text-emerald-400'
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  )

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="p-4 md:p-8 space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-glass gap-4">
        <div className="w-full text-left">
          <h1 className="text-3xl font-bold text-white tracking-tight">Mis Servicios</h1>
          <p className="text-slate-400 mt-1">Gestiona tus órdenes de mantenimiento y cotizaciones</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-400 hover:to-primary-500 font-bold transition-all shadow-glow whitespace-nowrap"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Servicio
        </button>
      </div>

      <div className="bg-surface/30 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex flex-wrap gap-3">
        {['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'COMPLETADA'].map(status => (
          <div key={status} className={`px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(status)}`}>
            {status} ({ordenes.filter(o => o.estado === status).length})
          </div>
        ))}
      </div>

      {ordenes.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-surface/30 border border-white/5 backdrop-blur-xl rounded-3xl p-16 text-center">
          <DocumentIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 text-xl font-medium mb-2">No hay órdenes aún</p>
          <p className="text-slate-500">Solicita un nuevo servicio para visualizarlo aquí</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {ordenes.map(orden => (
            <motion.div key={orden.id} variants={itemVariants} className="bg-surface/40 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-primary-500/30 transition-all shadow-glass p-6 overflow-hidden relative group">
              {/* Brillo dinámico hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-primary-500">#</span>{orden.id}
                  </h3>
                  <p className="text-sm text-slate-400">{new Date(orden.fechaSolicitud).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(orden.estado)}`}>
                    {orden.estado}
                  </span>
                  <span className={`text-xs font-bold ${getPrioridadColor(orden.prioridad)} uppercase tracking-wider`}>
                    PRIORIDAD {orden.prioridad}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6 bg-background/50 border border-white/5 p-4 rounded-2xl relative z-10">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Equipo</p>
                  <p className="text-slate-200 font-medium">{orden.equipo?.modelo}</p>
                  <p className="text-xs text-slate-400">{orden.equipo?.serial}</p>
                </div>
                {orden.tecnico && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Técnico</p>
                    <p className="text-slate-200 font-medium">{orden.tecnico.usuario.nombre}</p>
                  </div>
                )}
                <div className="md:col-span-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Problema</p>
                  <p className="text-slate-300 text-sm line-clamp-2">{orden.descripcion}</p>
                </div>
              </div>

              {orden.mantenimientos?.length > 0 && (
                <div className="bg-primary-500/10 border border-primary-500/20 p-4 rounded-2xl mb-4 relative z-10">
                  <p className="font-semibold text-primary-400 text-sm mb-2 flex items-center gap-2">
                    <DocumentIcon className="h-4 w-4" /> Historial de Trabajo:
                  </p>
                  {orden.mantenimientos.map(mant => (
                    <div key={mant.id} className="text-sm text-slate-300 ml-6 list-disc">
                      • <span className="font-medium text-white">{mant.tipo}</span> - {mant.horasTrabajadas ? `${mant.horasTrabajadas}h` : 'N/A'}
                    </div>
                  ))}
                </div>
              )}

              {orden.cotizaciones?.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-6 relative z-10">
                  <p className="font-semibold text-amber-400 text-sm mb-3">Cotización Emitida:</p>
                  {orden.cotizaciones.map(cot => (
                    <div key={cot.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-2xl font-bold text-amber-400">${Number(cot.total).toLocaleString('es-CO')}</p>
                        {cot.descripcion && <p className="text-slate-300 text-sm mt-1">{cot.descripcion}</p>}
                      </div>
                      {cot.estado === 'PENDIENTE' && (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button onClick={() => handleAprobarCotizacion(cot.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-xl text-sm font-bold transition-colors">
                            <CheckCircleIcon className="h-4 w-4" /> Aprobar
                          </button>
                        </div>
                      )}
                      {cot.estado === 'APROBADA' && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircleIcon className="h-4 w-4" /> APROBADA
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 relative z-10 mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={() => setSelectedOrden(orden)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-white/10 hover:bg-white/5 text-white rounded-xl font-medium transition-colors"
                >
                  <EyeIcon className="h-5 w-5" /> Ampliar Detalles
                </button>
                {orden.estado === 'PENDIENTE' && (
                  <button
                    onClick={() => handleCancelarOrden(orden.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-medium transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" /> Cancelar
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Nuevo Servicio */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              variants={modalVariants} initial="hidden" animate="visible" exit="hidden"
              className="bg-surface border border-white/10 rounded-3xl shadow-glow overflow-hidden max-w-lg w-full p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Solicitar Servicio</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white transition-colors">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSolicitarServicio} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Equipo</label>
                  <select
                    value={newOrden.equipoId}
                    onChange={(e) => setNewOrden({...newOrden, equipoId: e.target.value})}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-background text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400 transition-all appearance-none"
                    required
                  >
                    <option value="" className="text-slate-500">Selecciona el equipo asociado...</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.modelo} - {eq.serial}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Nivel de Urgencia</label>
                  <select
                    value={newOrden.prioridad}
                    onChange={(e) => setNewOrden({...newOrden, prioridad: e.target.value})}
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-background text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                  >
                    <option value="BAJA">Baja - Mantenimiento Rutinario</option>
                    <option value="MEDIA">Media - Falla Parcial</option>
                    <option value="ALTA">Alta - Falla Grave</option>
                    <option value="URGENTE">Urgente - Emergencia Operativa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Descripción del Problema</label>
                  <textarea
                    value={newOrden.descripcion}
                    onChange={(e) => setNewOrden({...newOrden, descripcion: e.target.value})}
                    placeholder="Describe en detalle los síntomas o sonido del equipo..."
                    className="w-full px-4 py-3 border border-white/10 rounded-xl bg-background text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 min-h-[120px]"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 border border-white/10 text-slate-300 rounded-xl hover:bg-white/5 font-bold transition-all">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-400 hover:to-primary-500 font-bold shadow-glow transition-all">
                    Emitir Orden
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

export default ClienteArea