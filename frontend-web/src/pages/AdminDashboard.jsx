import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
ChartJS.register(ArcElement, Tooltip, Legend)

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({})
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setMetrics(res.data))
    api.get('/admin/clientes').then(res => setClientes(res.data))
  }, [])

  const chartData = {
    labels: ['Clientes', 'Técnicos', 'Equipos', 'Órdenes Pendientes'],
    datasets: [{
      data: [metrics.totalClientes, metrics.totalTecnicos, metrics.totalEquipos, metrics.totalOrdenesPendientes],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    }]
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Clientes</h3>
          <p className="text-3xl font-bold text-primary-600">{metrics.totalClientes || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Técnicos</h3>
          <p className="text-3xl font-bold text-green-600">{metrics.totalTecnicos || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipos</h3>
          <p className="text-3xl font-bold text-orange-600">{metrics.totalEquipos || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pendientes</h3>
          <p className="text-3xl font-bold text-red-600">{metrics.totalOrdenesPendientes || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-6">Distribución</h3>
          <div className="h-64">
            <Pie data={chartData} />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-6">Clientes Recientes</h3>
          <div className="space-y-4">
            {clientes.slice(0,5).map(cliente => (
              <div key={cliente.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold">{cliente.empresa?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{cliente.usuario.nombre}</p>
                  <p className="text-sm text-gray-500">{cliente.nit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

