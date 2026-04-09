import { useState, useEffect } from 'react'
import { api } from '../services/api'

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
        api.get('/cliente/ordenes'),
        api.get('/cliente/equipos')
      ])
      setOrdenes(ordenesRes.data.data || [])
      setEquipos(equiposRes.data.data || [])
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
      alert('✅ Orden solicitada exitosamente')
      setNewOrden({ equipoId: '', descripcion: '', prioridad: 'MEDIA' })
      setShowForm(false)
      fetchData()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  const handleCancelarOrden = async (ordenId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta orden?')) return

    try {
      await api.put(`/cliente/ordenes/${ordenId}/cancelar`, {
        motivo: 'Cancelada por cliente'
      })
      alert('✅ Orden cancelada')
      fetchData()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  const handleAprobarCotizacion = async (cotizacionId) => {
    try {
      await api.put(`/cliente/cotizaciones/${cotizacionId}/aprobar`)
      alert('✅ Cotización aprobada')
      fetchData()
    } catch (error) {
      alert('❌ Error: ' + error.response?.data?.error)
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Servicios</h1>
            <p className="text-gray-600">Gestiona tus órdenes de mantenimiento</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium transition-all"
          >
            + Nuevo Servicio
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex gap-4 flex-wrap">
            {['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'COMPLETADA'].map(status => (
              <div
                key={status}
                className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-gray-100"
              >
                {status === 'PENDIENTE' && `⏳ ${ordenes.filter(o => o.estado === 'PENDIENTE').length}`}
                {status === 'ASIGNADA' && `👨‍🔧 ${ordenes.filter(o => o.estado === 'ASIGNADA').length}`}
                {status === 'EN_PROGRESO' && `🔄 ${ordenes.filter(o => o.estado === 'EN_PROGRESO').length}`}
                {status === 'COMPLETADA' && `✅ ${ordenes.filter(o => o.estado === 'COMPLETADA').length}`}
              </div>
            ))}
          </div>
        </div>

        {/* Órdenes */}
        {ordenes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No hay órdenes aún</p>
            <p className="text-gray-400">Solicita un nuevo servicio para comenzar</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {ordenes.map(orden => (
              <div key={orden.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Orden #{orden.id}</h3>
                    <p className="text-sm text-gray-500">{new Date(orden.fechaSolicitud).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      orden.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                      orden.estado === 'EN_PROGRESO' ? 'bg-blue-100 text-blue-800' :
                      orden.estado === 'ASIGNADA' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {orden.estado}
                    </span>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${
                      orden.prioridad === 'URGENTE' ? 'bg-red-100 text-red-800' :
                      orden.prioridad === 'ALTA' ? 'bg-orange-100 text-orange-800' :
                      orden.prioridad === 'MEDIA' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {orden.prioridad}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 bg-gray-50 p-4 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Equipo</p>
                    <p className="text-gray-900">{orden.equipo?.modelo}</p>
                    <p className="text-xs text-gray-500">{orden.equipo?.serial}</p>
                  </div>
                  {orden.tecnico && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Técnico</p>
                      <p className="text-gray-900">{orden.tecnico.usuario.nombre}</p>
                      <p className="text-xs text-gray-500">{orden.tecnico.especialidad}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Descripción</p>
                    <p className="text-gray-900 line-clamp-2">{orden.descripcion}</p>
                  </div>
                </div>

                {/* Mantenimientos */}
                {orden.mantenimientos && orden.mantenimientos.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded mb-4">
                    <p className="font-medium text-blue-900 mb-2">Mantenimientos Registrados:</p>
                    {orden.mantenimientos.map(mant => (
                      <div key={mant.id} className="text-sm text-blue-800 ml-4">
                        • {mant.tipo} - {mant.horasTrabajadas ? `${mant.horasTrabajadas}h` : 'Sin duración'}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cotizaciones */}
                {orden.cotizaciones && orden.cotizaciones.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded mb-4">
                    <p className="font-medium text-yellow-900 mb-2">Cotización Pendiente:</p>
                    {orden.cotizaciones.map(cot => (
                      <div key={cot.id} className="flex justify-between items-center">
                        <div className="text-sm">
                          <p className="text-yellow-800"><strong>${Number(cot.total).toLocaleString('es-CO')}</strong></p>
                          {cot.descripcion && <p className="text-yellow-700 text-xs">{cot.descripcion}</p>}
                        </div>
                        {cot.estado === 'PENDIENTE' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAprobarCotizacion(cot.id)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              ✅ Aprobar
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                              ❌ Rechazar
                            </button>
                          </div>
                        )}
                        {cot.estado === 'APROBADA' && (
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                            APROBADA
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrden(orden)}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                  >
                    👁️ Ver Detalle
                  </button>
                  {orden.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => handleCancelarOrden(orden.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Solicitar Servicio */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Solicitar Nuevo Servicio</h2>

              <form onSubmit={handleSolicitarServicio}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipo</label>
                  <select
                    value={newOrden.equipoId}
                    onChange={(e) => setNewOrden({...newOrden, equipoId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona un equipo...</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>
                        {eq.modelo} - {eq.serial}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                  <select
                    value={newOrden.prioridad}
                    onChange={(e) => setNewOrden({...newOrden, prioridad: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción del Problema</label>
                  <textarea
                    value={newOrden.descripcion}
                    onChange={(e) => setNewOrden({...newOrden, descripcion: e.target.value})}
                    placeholder="Describe el problema con tu equipo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Solicitar
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

export default ClienteArea