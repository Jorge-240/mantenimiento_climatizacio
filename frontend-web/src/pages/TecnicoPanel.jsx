import { useState, useEffect } from 'react'
import { api } from '../services/api'

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
      const res = await api.get(`/tecnico/ordenes`, {
        params: { estado: filter }
      })
      setOrdenes(res.data.data || [])
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
      alert('✅ Mantenimiento registrado')
      setMantenimiento({ tipo: 'PREVENTIVO', descripcion: '', horasTrabajadas: '' })
      setSelectedOrden(null)
      setShowForm(false)
      fetchOrdenes()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  const handleCompletarOrden = async (ordenId) => {
    try {
      await api.put(`/tecnico/ordenes/${ordenId}/completar`, {})
      alert('✅ Orden completada')
      fetchOrdenes()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando órdenes...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel Técnico</h1>
          <p className="text-gray-600">Gestiona tus órdenes de mantenimiento y registra actividades</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 flex-wrap">
            {['EN_PROGRESO', 'PENDIENTE', 'COMPLETADA'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status === 'EN_PROGRESO' && '🔄 En Progreso'}
                {status === 'PENDIENTE' && '⏳ Pendientes'}
                {status === 'COMPLETADA' && '✅ Completadas'}
              </button>
            ))}
          </div>
        </div>

        {/* Órdenes Grid */}
        {ordenes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No hay órdenes en este estado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ordenes.map(orden => (
              <div key={orden.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Orden #{orden.id}</h3>
                    <p className="text-sm text-gray-500">{orden.cliente.usuario.nombre}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    orden.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800' :
                    orden.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {orden.estado}
                  </span>
                </div>

                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-sm text-gray-700"><strong>Equipo:</strong> {orden.equipo.modelo}</p>
                  <p className="text-sm text-gray-700"><strong>Serial:</strong> {orden.equipo.serial}</p>
                  <p className="text-sm text-gray-700"><strong>Ubicación:</strong> {orden.equipo.ubicacion}</p>
                  <p className="text-sm text-gray-700 line-clamp-2 mt-2"><strong>Descripción:</strong> {orden.descripcion}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrden(orden)
                      setShowForm(true)
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    📝 Registrar Mant.
                  </button>
                  {orden.mantenimientos && orden.mantenimientos.length > 0 && (
                    <button
                      onClick={() => handleCompletarOrden(orden.id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      ✅ Completar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Mantenimiento */}
        {showForm && selectedOrden && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Registrar Mantenimiento</h2>
              <p className="text-gray-600 mb-6">Orden #{selectedOrden.id} - {selectedOrden.equipo.modelo}</p>

              <form onSubmit={handleCrearMantenimiento}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    value={mantenimiento.tipo}
                    onChange={(e) => setMantenimiento({...mantenimiento, tipo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PREVENTIVO">Preventivo</option>
                    <option value="CORRECTIVO">Correctivo</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={mantenimiento.descripcion}
                    onChange={(e) => setMantenimiento({...mantenimiento, descripcion: e.target.value})}
                    placeholder="Describe el trabajo realizado..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horas Trabajadas</label>
                  <input
                    type="number"
                    step="0.5"
                    value={mantenimiento.horasTrabajadas}
                    onChange={(e) => setMantenimiento({...mantenimiento, horasTrabajadas: e.target.value})}
                    placeholder="2.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setMantenimiento({ tipo: 'PREVENTIVO', descripcion: '', horasTrabajadas: '' })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TecnicoPanel