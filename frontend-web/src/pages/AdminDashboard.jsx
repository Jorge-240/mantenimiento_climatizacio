import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import { UsersIcon, WrenchScrewdriverIcon, ServerIcon, ClockIcon } from '@heroicons/react/24/outline'

ChartJS.register(ArcElement, Tooltip, Legend)

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({})
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setMetrics(res.data)).catch(() => {})
    api.get('/admin/clientes').then(res => setClientes(res.data)).catch(() => {})
  }, [])

  const chartData = {
    labels: ['Clientes', 'Técnicos', 'Equipos', 'Pendientes'],
    datasets: [{
      data: [metrics.totalClientes || 0, metrics.totalTecnicos || 0, metrics.totalEquipos || 0, metrics.totalOrdenesPendientes || 0],
      backgroundColor: ['#0ea5e9', '#14b8a6', '#6366f1', '#f43f5e'],
      borderColor: '#1E293B',
      borderWidth: 2,
      hoverOffset: 4
    }]
  }

  const chartOptions = {
    plugins: {
      legend: {
        labels: { color: '#cbd5e1' }
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  const metricCards = [
    { title: 'Clientes Registrados', value: metrics.totalClientes, icon: UsersIcon, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { title: 'Técnicos Activos', value: metrics.totalTecnicos, icon: WrenchScrewdriverIcon, color: 'text-accent-500', bg: 'bg-accent-500/10' },
    { title: 'Equipos Monitoreados', value: metrics.totalEquipos, icon: ServerIcon, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Órdenes Pendientes', value: metrics.totalOrdenesPendientes, icon: ClockIcon, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ]

  return (
    <motion.div 
      className="p-4 md:p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center bg-surface/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-glass">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h2>
          <p className="text-slate-400 mt-1">Monitoreo general de climatización</p>
        </div>
        <div className="hidden sm:block">
           <div className="flex space-x-3 items-center">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
             </span>
             <span className="text-accent-400 font-medium text-sm">Sistema en línea</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            className="group bg-surface/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-glass hover:border-primary-500/50 transition-all duration-300 relative overflow-hidden"
          >
            {/* Resplandor decorativo */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${card.bg} blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">{card.title}</p>
                <p className={`text-4xl font-bold ${card.color}`}>{card.value || 0}</p>
              </div>
              <div className={`p-3 rounded-2xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="bg-surface/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-glass lg:col-span-1 flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-white mb-6 self-start w-full border-b border-white/10 pb-4">Distribución Global</h3>
          <div className="h-64 w-full flex justify-center">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-surface/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-glass lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Actividad Reciente: Clientes</h3>
          <div className="space-y-4">
            {clientes.length === 0 ? (
               <p className="text-slate-400 text-center py-8">Cargando datos o sin clientes registrados...</p>
            ) : clientes.slice(0, 5).map((cliente, i) => (
              <motion.div 
                key={cliente.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-white/5 hover:bg-surface transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-500/20 border border-primary-500/30 rounded-full flex items-center justify-center mr-4 group-hover:shadow-glow transition-all">
                    <span className="text-primary-400 font-bold">{cliente.empresa?.charAt(0) || 'C'}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200">{cliente.usuario?.nombre || 'Desconocido'}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{cliente.nit || 'Sin NIT'}</p>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-accent-500 font-medium px-3 py-1 bg-accent-500/10 rounded-full">Activo</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard
