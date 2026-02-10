<template>
  <div class="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Agregar Entidad</h2>

    <form @submit.prevent="guardarEntidad" class="space-y-4">
      <!-- Nombre -->
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700">Nombre de la entidad *</label>
        <input
          v-model="formulario.nombre"
          type="text"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Universidad Nacional"
        />
      </div>

      <!-- Departamento -->
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700">Departamento *</label>
        <select
          v-model="formulario.departamento"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar departamento</option>
          <option v-for="dep in departamentos" :key="dep.id" :value="dep.id">
            {{ dep.nombre }} ({{ dep.capital }})
          </option>
        </select>
      </div>

      <!-- Logo -->
      <div>
        <label class="block text-sm font-medium mb-1 text-gray-700">Logo (opcional)</label>
        <input
          type="file"
          accept="image/*"
          @change="manejarArchivo"
          ref="inputArchivo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
        <p class="text-xs text-gray-500 mt-1">Formatos: PNG, JPG, SVG (máx. 2MB)</p>
      </div>

      <!-- Vista previa -->
      <div v-if="vistaPrevia" class="mt-2">
        <p class="text-xs text-gray-600 mb-1">Vista previa:</p>
        <img
          :src="vistaPrevia"
          alt="Vista previa"
          class="w-20 h-20 object-contain border rounded"
        />
      </div>

      <!-- Mensaje de éxito -->
      <div
        v-if="mensajeExito"
        class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded"
      >
        {{ mensajeExito }}
      </div>

      <!-- Botones -->
      <div class="flex gap-2 pt-2">
        <button
          type="submit"
          class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
        >
          Guardar
        </button>
        <button
          type="button"
          @click="limpiarFormulario"
          class="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition font-medium"
        >
          Limpiar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useEntidadesStore } from '@/stores/entidadesStore'
import { departamentos } from '@/data/departamentos'

const store = useEntidadesStore()
const formulario = ref({
  nombre: '',
  departamento: '',
  logo: '',
})
const vistaPrevia = ref('')
const inputArchivo = ref(null)
const mensajeExito = ref('')

function manejarArchivo(evento) {
  const archivo = evento.target.files[0]
  if (archivo) {
    // Validar tamaño
    if (archivo.size > 2 * 1024 * 1024) {
      alert('El archivo es muy grande. Máximo 2MB')
      return
    }

    // Generar vista previa
    const reader = new FileReader()
    reader.onload = (e) => {
      vistaPrevia.value = e.target.result
    }
    reader.readAsDataURL(archivo)

    // Guardar nombre del archivo
    formulario.value.logo = `logos/${archivo.name}`
  }
}

function guardarEntidad() {
  store.agregarEntidad(formulario.value)
  mensajeExito.value = '✓ Entidad agregada correctamente'

  setTimeout(() => {
    limpiarFormulario()
    mensajeExito.value = ''
  }, 2000)
}

function limpiarFormulario() {
  formulario.value = {
    nombre: '',
    departamento: '',
    logo: '',
  }
  vistaPrevia.value = ''
  if (inputArchivo.value) {
    inputArchivo.value.value = ''
  }
}
</script>
