import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import entidadesIniciales from '@/data/entidades.json'

export const useEntidadesStore = defineStore('entidades', () => {
  // Estado
  const entidades = ref([])
  const departamentoSeleccionado = ref(null)
  const cargando = ref(false)

  // Getters (propiedades computadas)
  const entidadesPorDepartamento = computed(() => {
    if (!departamentoSeleccionado.value) {
      return entidades.value
    }
    return entidades.value.filter((e) => e.departamento === departamentoSeleccionado.value)
  })

  const totalEntidades = computed(() => entidades.value.length)

  const entidadesPorDepartamentoCount = computed(() => {
    const counts = {}
    entidades.value.forEach((entidad) => {
      if (!counts[entidad.departamento]) {
        counts[entidad.departamento] = 0
      }
      counts[entidad.departamento]++
    })
    return counts
  })

  // Actions (métodos)
  function agregarEntidad(entidad) {
    const nuevaEntidad = {
      ...entidad,
      id: Date.now(),
      fechaRegistro: new Date().toISOString(),
    }
    entidades.value.push(nuevaEntidad)
    guardarEnLocalStorage()
  }

  function agregarMultiplesEntidades(nuevasEntidades) {
    nuevasEntidades.forEach((entidad) => {
      agregarEntidad(entidad)
    })
  }

  function eliminarEntidad(id) {
    entidades.value = entidades.value.filter((e) => e.id !== id)
    guardarEnLocalStorage()
  }

  function actualizarEntidad(id, datos) {
    const index = entidades.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      entidades.value[index] = { ...entidades.value[index], ...datos }
      guardarEnLocalStorage()
    }
  }

  function seleccionarDepartamento(departamentoId) {
    departamentoSeleccionado.value = departamentoId
  }

  function limpiarSeleccion() {
    departamentoSeleccionado.value = null
  }

  function guardarEnLocalStorage() {
    localStorage.setItem('entidades', JSON.stringify(entidades.value))
  }

  function cargarDesdeLocalStorage() {
    const datos = localStorage.getItem('entidades')
    if (datos) {
      entidades.value = JSON.parse(datos)
    } else {
      entidades.value = entidadesIniciales.entidades || []
    }
  }

  function limpiarTodo() {
    entidades.value = []
    localStorage.removeItem('entidades')
  }

  return {
    entidades,
    departamentoSeleccionado,
    cargando,
    entidadesPorDepartamento,
    totalEntidades,
    entidadesPorDepartamentoCount,
    agregarEntidad,
    agregarMultiplesEntidades,
    eliminarEntidad,
    actualizarEntidad,
    seleccionarDepartamento,
    limpiarSeleccion,
    cargarDesdeLocalStorage,
    limpiarTodo,
  }
})
