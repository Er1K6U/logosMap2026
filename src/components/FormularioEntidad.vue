<template>
  <div
    class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 max-w-md mx-auto"
  >
    <h2 class="text-2xl font-bold mb-6 text-white">Agregar Entidad</h2>

    <form @submit.prevent="guardarEntidad" class="space-y-5">
      <!-- Nombre -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">Nombre de la entidad *</label>
        <input
          v-model="formulario.nombre"
          type="text"
          required
          class="w-full px-4 py-3 bg-gray-900/70 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500
                 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          placeholder="Ej: Universidad Nacional"
        />
      </div>

      <!-- Departamento -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">Departamento *</label>
        <select
          v-model="formulario.departamento"
          required
          class="w-full px-4 py-3 bg-gray-900/70 border border-white/10 rounded-xl text-sm text-white
                 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
        >
          <option value="" class="bg-gray-900">Seleccionar departamento</option>
          <option v-for="dep in departamentos" :key="dep.id" :value="dep.id" class="bg-gray-900">
            {{ dep.nombre }} ({{ dep.capital }})
          </option>
        </select>
      </div>

      <!-- Logo -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-200">Logo (opcional)</label>

        <div
          class="flex items-center gap-3 w-full px-4 py-3 bg-gray-900/70 border border-white/10 rounded-xl"
        >
          <input
            type="file"
            accept="image/*"
            @change="manejarArchivo"
            ref="inputArchivo"
            class="block w-full text-sm text-gray-300
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-lg file:border-0
                   file:bg-white/10 file:text-gray-100
                   hover:file:bg-white/20
                   transition"
          />
        </div>

        <p class="text-xs text-gray-400 mt-2">Formatos: PNG, JPG, SVG (máx. 2MB)</p>
      </div>

      <!-- Vista previa -->
      <div v-if="vistaPrevia" class="mt-1">
        <p class="text-xs text-gray-300 mb-2">Vista previa:</p>
        <div class="inline-flex items-center gap-3">
          <div class="w-20 h-20 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center">
            <img :src="vistaPrevia" alt="Vista previa" class="w-16 h-16 object-contain" />
          </div>
          <div class="text-xs text-gray-400">
            <p class="font-medium text-gray-200">Logo cargado</p>
            <p>Se usará en el marcador.</p>
          </div>
        </div>
      </div>

      <!-- Mensaje de éxito -->
      <div
        v-if="mensajeExito"
        class="bg-emerald-500/10 border border-emerald-400/20 text-emerald-200 px-4 py-3 rounded-xl text-sm"
      >
        {{ mensajeExito }}
      </div>

      <!-- Botones -->
      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          class="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold
                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-cyan-500/20"
        >
          Guardar
        </button>
        <button
          type="button"
          @click="limpiarFormulario"
          class="flex-1 bg-white/10 text-gray-200 py-3 rounded-xl font-semibold
                 hover:bg-white/20 transition"
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

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function manejarArchivo(evento) {
  const archivo = evento.target.files?.[0]
  if (!archivo) return

  // Validar tamaño (localStorage no aguanta logos gigantes)
  if (archivo.size > 2 * 1024 * 1024) {
    alert('El archivo es muy grande. Máximo 2MB')
    vistaPrevia.value = ''
    formulario.value.logo = ''
    if (inputArchivo.value) inputArchivo.value.value = ''
    return
  }

  try {
    const dataUrl = await fileToDataURL(archivo)

    // ✅ Preview
    vistaPrevia.value = dataUrl

    // ✅ Guardamos BASE64 en la entidad (persistirá en localStorage)
    formulario.value.logo = dataUrl
  } catch (e) {
    console.error('Error leyendo archivo:', e)
    alert('No se pudo leer el archivo.')
    vistaPrevia.value = ''
    formulario.value.logo = ''
    if (inputArchivo.value) inputArchivo.value.value = ''
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
