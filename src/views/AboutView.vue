<template>
  <div class="admin min-h-screen bg-gray-100 py-8">
    <div class="container mx-auto px-4">
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
        <p class="text-gray-600">Gestiona las entidades del mapa de Colombia</p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-600">Total de entidades</p>
          <p class="text-3xl font-bold text-blue-600">{{ store.totalEntidades }}</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-600">Departamentos</p>
          <p class="text-3xl font-bold text-green-600">33</p>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <p class="text-sm text-gray-600">Departamento seleccionado</p>
          <p class="text-lg font-bold text-purple-600">
            {{ departamentoActual || 'Ninguno' }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-4">
        <div class="flex gap-2 border-b">
          <button
            @click="tabActivo = 'formulario'"
            :class="[
              'px-4 py-2 font-medium transition',
              tabActivo === 'formulario'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800',
            ]"
          >
            Agregar Manual
          </button>
          <button
            @click="tabActivo = 'importar'"
            :class="[
              'px-4 py-2 font-medium transition',
              tabActivo === 'importar'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800',
            ]"
          >
            Importar Excel
          </button>
          <button
            @click="tabActivo = 'lista'"
            :class="[
              'px-4 py-2 font-medium transition',
              tabActivo === 'lista'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800',
            ]"
          >
            Lista de Entidades
          </button>
        </div>
      </div>

      <!-- Contenido de los tabs -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <FormularioEntidad v-if="tabActivo === 'formulario'" />
        <ImportadorExcel v-if="tabActivo === 'importar'" />

        <!-- Lista de entidades -->
        <div v-if="tabActivo === 'lista'">
          <div v-if="store.totalEntidades === 0" class="text-center py-8 text-gray-500">
            No hay entidades registradas
          </div>
          <div v-else>
            <div class="mb-4 flex justify-between items-center">
              <p class="text-sm text-gray-600">
                {{ store.totalEntidades }} entidad(es) registrada(s)
              </p>
              <button
                @click="confirmarLimpiar"
                class="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Limpiar todo
              </button>
            </div>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div
                v-for="entidad in store.entidades"
                :key="entidad.id"
                class="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100"
              >
                <div>
                  <p class="font-medium">{{ entidad.nombre }}</p>
                  <p class="text-xs text-gray-600">
                    {{ obtenerNombreDepartamento(entidad.departamento) }}
                  </p>
                </div>
                <button
                  @click="eliminarEntidad(entidad.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón volver al mapa -->
      <div class="mt-8 text-center">
        <RouterLink
          to="/"
          class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          ← Volver al Mapa
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { getDepartamentoById } from '@/data/departamentos'
import FormularioEntidad from '@/components/FormularioEntidad.vue'
import ImportadorExcel from '@/components/ImportadorExcel.vue'

const store = useEntidadesStore()
const tabActivo = ref('formulario')

const departamentoActual = computed(() => {
  if (!store.departamentoSeleccionado) return 'Todos'
  const dep = getDepartamentoById(store.departamentoSeleccionado)
  return dep ? dep.nombre : 'Desconocido'
})

function obtenerNombreDepartamento(id) {
  const dep = getDepartamentoById(id)
  return dep ? dep.nombre : id
}

function eliminarEntidad(id) {
  if (confirm('¿Estás seguro de eliminar esta entidad?')) {
    store.eliminarEntidad(id)
  }
}

function confirmarLimpiar() {
  if (confirm('¿Estás seguro de eliminar TODAS las entidades? Esta acción no se puede deshacer.')) {
    store.limpiarTodo()
  }
}
</script>
