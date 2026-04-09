import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { motion } from 'framer-motion'
import { 
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([])
  const [tecnicos, setTecnicos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ordenRes, tecnicoRes] = await Promise.all([
        api.get('/admin/ordenes'),
        api.get('/admin/tecnicos')
      ])
      setOrdenes(ordenRes.data.data || [])
      setTecnicos(tecnicoRes.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAsignar = async (ordenId, tecnicoId) => {
    if (!tecnicoId) return
    try {
      await api.post('/admin/ordenes/asignar', { ordenId, tecnicoId })
      fetchData()
    } catch (error) {
      alert('Error al asignar técnico')
    }
  }

  const getStatusStyle = (status) => {
    const styles = {
      PENDIENTE: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      ASIGNADA: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      EN_PROGRESO: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
      COMPLETADA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      CANCELADA: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    }
    return styles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-glass flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Órdenes de Trabajo</h2>
          <p className="text-slate-400 mt-1">Gestión de servicios y mantenimientos</p>
        </div>
        <div className="flex gap-2 text-xs font-bold text-slate-500 bg-background/50 p-2 rounded-2xl">
           <span className="flex items-center gap-1"><ClockIcon className="h-4 w-4"/> {ordenes.filter(o => o.estado === 'PENDIENTE').length} Pendientes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">Cargando órdenes de trabajo...</div>
        ) : ordenes.length === 0 ? (
          <div className="bg-surface/30 border border-dashed border-white/10 rounded-3xl p-12 text-center text-slate-500">
            No se encontraron órdenes de trabajo registradas.
          </div>
        ) : ordenes.map((orden) => (
          <motion.div 
            key={orden.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-surface/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-glass flex flex-col lg:flex-row lg:items-center gap-8 hover:border-primary-500/30 transition-all"
          >
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(orden.estado)}`}>
                  {orden.estado}
                </span>
                <span className="text-[10px] font-mono text-slate-500">ID: #{orden.id.toString().padStart(4, '0')}</span>
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-white mb-1">{orden.tipoMantenimiento}</h4>
                <p className="text-slate-400 text-sm line-clamp-1">{orden.descripcion || 'Sin descripción adicional'}</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/5 pt-4">
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Cliente</p>
                   <p className="text-sm font-semibold text-slate-200">{orden.cliente?.empresa}</p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Equipo</p>
                   <p className="text-sm font-semibold text-slate-200">{orden.equipo?.modelo}</p>
                </div>
                <div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Prioridad</p>
                   <p className={`text-sm font-bold ${orden.prioridad === 'ALTA' ? 'text-rose-400' : 'text-blue-400'}`}>{orden.prioridad}</p>
                </div>
              </div>
            </div>

            <div className="lg:w-80 space-y-4 lg:pl-8 lg:border-l border-white/5">
               <p className="text-xs font-bold text-slate-500 uppercase">Técnico Asignado</p>
               {orden.tecnico ? (
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="h-10 w-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                       <UserGroupIcon className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-white">{orden.tecnico.usuario?.nombre}</p>
                       <p className="text-[10px] text-slate-500 font-medium">En servicio</p>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-3">
                    <select 
                      className="w-full bg-background/50 border border-white/10 rounded-xl py-2 px-4 text-slate-300 text-sm focus:outline-none focus:border-indigo-500/50"
                      onChange={(e) => handleAsignar(orden.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Seleccionar para asignar...</option>
                      {tecnicos.map(t => (
                        <option key={t.id} value={t.id}>{t.usuario?.nombre}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                       <ExclamationCircleIcon className="h-3 w-3"/> Requiere asignación manual
                    </p>
                 </div>
               )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Ordenes
